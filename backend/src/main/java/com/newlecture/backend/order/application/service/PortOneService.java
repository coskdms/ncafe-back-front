package com.newlecture.backend.order.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
public class PortOneService {

    @Value("${portone.api.secret}")
    private String apiSecret;

    @Value("${portone.webhook.secret}")
    private String webhookSecret;

    // ★ 외부 결제 API 호출이 무한 대기하며 DB 커넥션을 잡지 않도록 타임아웃 필수
    private final RestTemplate restTemplate = buildRestTemplate();

    // 웹훅 리플레이 방어: 허용 시간 오차(초)
    private static final long WEBHOOK_TOLERANCE_SEC = 300;

    private static RestTemplate buildRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(3));
        factory.setReadTimeout(Duration.ofSeconds(5));
        return new RestTemplate(factory);
    }

    /**
     * PortOne 결제 조회 결과 (검증에 필요한 최소 정보)
     */
    public record PaymentInfo(String status, long totalAmount) {}

    /**
     * PortOne V2 결제 단건 조회 → 결제 상태와 실결제 금액 반환
     */
    @SuppressWarnings("unchecked")
    public PaymentInfo getPayment(String paymentId) {
        if (apiSecret == null || apiSecret.trim().isEmpty() || apiSecret.equals("default-secret")) {
            log.error("PortOne API Secret이 설정되지 않았습니다. 환경변수를 확인해주세요.");
            throw new RuntimeException("결제 검증을 위한 API 키가 유효하지 않습니다.");
        }

        String url = "https://api.portone.io/payments/" + paymentId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "PortOne " + apiSecret.trim());

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            Map<String, Object> body = response.getBody();
            if (body == null) {
                throw new RuntimeException("PortOne 결제 조회 응답이 비어 있습니다.");
            }

            String status = String.valueOf(body.get("status"));
            long total = 0L;
            Object amountObj = body.get("amount");
            if (amountObj instanceof Map<?, ?> amount) {
                Object totalObj = ((Map<String, Object>) amount).get("total");
                if (totalObj instanceof Number n) {
                    total = n.longValue();
                }
            }
            return new PaymentInfo(status, total);
        } catch (Exception e) {
            log.error("PortOne 결제 조회 실패: paymentId={}, error={}", paymentId, e.getMessage());
            throw new RuntimeException("결제 내역을 조회하지 못했습니다: " + e.getMessage());
        }
    }

    /**
     * PortOne V2 웹훅 서명 검증 (Standard Webhooks 규격)
     * 서명 대상: "{webhook-id}.{webhook-timestamp}.{rawBody}"
     * 키: webhookSecret("whsec_" 접두어 제거 후 base64 디코드)
     */
    public boolean verifyWebhook(String rawBody, HttpHeaders headers) {
        if (webhookSecret == null || webhookSecret.isBlank() || webhookSecret.equals("default-webhook")) {
            log.error("PortOne 웹훅 시크릿이 설정되지 않았습니다. 웹훅을 거부합니다.");
            return false;
        }

        String webhookId = headers.getFirst("webhook-id");
        String timestamp = headers.getFirst("webhook-timestamp");
        String signatureHeader = headers.getFirst("webhook-signature");

        if (!StringUtils.hasText(webhookId) || !StringUtils.hasText(timestamp)
                || !StringUtils.hasText(signatureHeader) || rawBody == null) {
            log.warn("[웹훅검증] 필수 서명 헤더 누락");
            return false;
        }

        // ★ 리플레이 방어: 타임스탬프 신선도 검사 (허용 오차 밖이면 거부)
        try {
            long skew = Math.abs(System.currentTimeMillis() / 1000L - Long.parseLong(timestamp.trim()));
            if (skew > WEBHOOK_TOLERANCE_SEC) {
                log.warn("[웹훅검증] 타임스탬프 만료(skew={}s)", skew);
                return false;
            }
        } catch (NumberFormatException e) {
            log.warn("[웹훅검증] 타임스탬프 형식 오류: {}", timestamp);
            return false;
        }

        try {
            String secret = webhookSecret.startsWith("whsec_") ? webhookSecret.substring(6) : webhookSecret;
            byte[] key = Base64.getDecoder().decode(secret);

            String signedContent = webhookId + "." + timestamp + "." + rawBody;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            byte[] hash = mac.doFinal(signedContent.getBytes(StandardCharsets.UTF_8));
            String expected = Base64.getEncoder().encodeToString(hash);

            // 헤더는 "v1,<sig> v1,<sig2>" 형태로 여러 서명이 공백으로 구분될 수 있음
            for (String part : signatureHeader.split(" ")) {
                String sig = part.contains(",") ? part.substring(part.indexOf(',') + 1) : part;
                if (constantTimeEquals(sig, expected)) {
                    return true;
                }
            }
            log.warn("[웹훅검증] 서명 불일치");
            return false;
        } catch (Exception e) {
            log.error("[웹훅검증] 오류: {}", e.getMessage());
            return false;
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * PortOne V2 결제 취소 (환불) 요청
     */
    public void cancelPayment(String paymentId, String reason) {
        String url = "https://api.portone.io/payments/" + paymentId + "/cancel";

        if (apiSecret == null || apiSecret.trim().isEmpty() || apiSecret.equals("default-secret")) {
            log.error("PortOne API Secret이 설정되지 않았습니다. 환경변수를 확인해주세요.");
            throw new RuntimeException("결제 취소를 위한 API 키가 유효하지 않습니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        // 헤더 형식을 명확하게 문자열 결합하여 전달 (trim 추가)
        headers.set("Authorization", "PortOne " + apiSecret.trim());
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("reason", reason);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            log.info("PortOne V2 취소 요청 시작: paymentId={}, reason={}", paymentId, reason);
            restTemplate.postForEntity(url, entity, Map.class);
            log.info("PortOne V2 취소 성공: {}", paymentId);
        } catch (Exception e) {
            log.error("PortOne V2 취소 실패: paymentId={}, error={}", paymentId, e.getMessage());
            // 실제 환경에서는 결제 취소 실패 시 적절한 예외 처리 또는 재시도 로직이 필요할 수 있습니다.
            // 여기서는 일단 로그만 남기고 진행하거나 필요시 런타임 예외를 던집니다.
            throw new RuntimeException("PG사 결제 취소 요청 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}

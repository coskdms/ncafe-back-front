package com.newlecture.backend.order.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
public class PortOneService {

    @Value("${portone.api.secret}")
    private String apiSecret;

    private final RestTemplate restTemplate = new RestTemplate();

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

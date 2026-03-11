package com.newlecture.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;


@SpringBootApplication
@EnableScheduling
public class BackendApplication {


	@PostConstruct
	public void init() {
		// JVM 전역 시간대를 한국 시간(KST)으로 고정
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}

	public static void main(String[] args) {

		// 톰캣 서버 실행 -> 웹서버가 실행됨
		SpringApplication.run(BackendApplication.class, args);
	}

}

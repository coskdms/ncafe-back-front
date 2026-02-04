package com.newlecture.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// 톰캣 서버 실행 -> 웹서버가 실행됨
		SpringApplication.run(BackendApplication.class, args);
	}

}

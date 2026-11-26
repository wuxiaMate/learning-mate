package com.wuxiamate.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * {@code @CreatedDate}가 붙은 필드(created_at)를 저장 시점에 자동으로 채워요.
 * BackendApplication에 바로 붙이지 않고 따로 둔 이유: 컨트롤러만 띄우는 테스트(@WebMvcTest)에서
 * JPA 설정이 없다는 오류가 나지 않게 하려고요.
 */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}

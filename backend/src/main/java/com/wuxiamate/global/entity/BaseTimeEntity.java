package com.wuxiamate.global.entity;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

/**
 * 모든 테이블에 있는 created_at 을 한곳에서 관리하는 부모 클래스.
 * 상속받은 엔티티의 테이블에 created_at 컬럼이 생겨요 (이 클래스 자체는 테이블이 아니에요).
 *
 * <p>시각은 {@link Instant}(UTC 기준 한 순간)로 다뤄요. PostgreSQL에서는 TIMESTAMPTZ 컬럼이 돼요.
 */
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseTimeEntity {

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;
}

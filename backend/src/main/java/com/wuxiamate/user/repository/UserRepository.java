package com.wuxiamate.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.wuxiamate.user.entity.User;

/**
 * users 테이블 접근 (기존 DAO 역할).
 * save, findById, findAll, delete 등은 JpaRepository 가 이미 만들어 줘요.
 */
public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByNickname(String nickname);
}

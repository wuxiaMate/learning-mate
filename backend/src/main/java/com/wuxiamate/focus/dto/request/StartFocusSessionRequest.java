package com.wuxiamate.focus.dto.request;

import java.time.OffsetDateTime;

import com.wuxiamate.focus.enums.SessionMode;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

//폐관 시작 버튼을 누르면, 프런트가 서버에 어떤 값을 보내는지 정의하는 DTO
//요청의 필드와 타입을 선언. Java가 생성자와 mode(), goal(), startedAt() 같은 접근 메서드를 만든다.
public record StartFocusSessionRequest(
		@NotNull SessionMode mode,
		@Size(max=100) String goal,
		@NotNull OffsetDateTime startedAt) {}

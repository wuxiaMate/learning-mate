package com.wuxiamate.focus.entity;

import java.time.Instant;

import com.wuxiamate.focus.enums.SessionMode;
import com.wuxiamate.focus.enums.SessionState;
import com.wuxiamate.focus.enums.SessionStatus;
import com.wuxiamate.global.entity.BaseTimeEntity;
import com.wuxiamate.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name="focus_sessions")
@Getter
@NoArgsConstructor(access=AccessLevel.PROTECTED)
public class FocusSession extends BaseTimeEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private SessionMode mode;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private SessionStatus status;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "current_state", nullable = false, length = 10)
	private SessionState currentState;
	
	@Column(length = 100)
	private String goal;
	
	@Column(name = "started_at", nullable = false)
	private Instant startedAt;

	public FocusSession(User user, SessionMode mode, String goal, Instant startedAt) {
		this.user = user;
		this.mode = mode;
		this.goal = goal;
		this.startedAt = startedAt;
		this.status = SessionStatus.ACTIVE;
		this.currentState = SessionState.FOCUS;
	}
	
	public static FocusSession start(User user, SessionMode mode, String goal, Instant startedAt) {
		return new FocusSession(user, mode, goal, startedAt);
	}
	
}

package com.wuxiamate.global.response;

public record ApiResponse<T>(boolean success, T data, ErrorBody error) {
	
	public static <T> ApiResponse<T> ok(T data){
		return new ApiResponse<>(true, data, null);
	}
	
	public record ErrorBody(String code, String message) {
		
	}
}

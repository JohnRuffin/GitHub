package com.spacetimeinsight.sse.atmosphere;

public class Response {
	private String author;
	private String message;
	
	public Response(String author, String message){
		this.author = author;
		this.message = message;
	}
	
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
}

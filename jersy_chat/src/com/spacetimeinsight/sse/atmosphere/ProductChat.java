package com.spacetimeinsight.sse.atmosphere;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import org.atmosphere.annotation.Broadcast;
import org.atmosphere.annotation.Suspend;

@Path("/") 
public class ProductChat {

	@Suspend(contentType = "application/json")
	@GET
	public String suspend(){
		return "";
	}
	
	@Broadcast(writeEntity = false)
	@POST
	@Produces("application/json")
	public Response broadcast(Message message){
		return new Response(message.getAuthor(), message.getMessage());
	}
}

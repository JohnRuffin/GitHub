package com.spacetimeinsight.atmosphere;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.atmosphere.cpr.MetaBroadcaster;

public class SINotificationHandler extends HttpServlet {

	private static final long serialVersionUID = -968931611673112433L;

	protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		doPost(req, res);
	}

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		String message = req.getParameter("message");
		if(message != null){
			MetaBroadcaster.getDefault()
			.broadcastTo("/custom", message);
		}
	}
}

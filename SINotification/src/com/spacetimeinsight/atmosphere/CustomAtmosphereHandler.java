package com.spacetimeinsight.atmosphere;

import java.io.IOException;
import java.util.Map;

import org.atmosphere.config.service.AtmosphereHandlerService;
import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResponse;

@AtmosphereHandlerService(path = "/custom")
public class CustomAtmosphereHandler implements AtmosphereHandler {
	private static boolean registered = false;
	private static long counter = 0L;

	public void destroy() {
	}

	@SuppressWarnings("rawtypes")
	public void onRequest(AtmosphereResource r) throws IOException {
		AtmosphereRequest req = r.getRequest();
		Map map = req.getParameterMap();
		String broadcasterId = (String) map.get("broadcasterId");
		if (broadcasterId == null) {
			broadcasterId = "self";
		}
		String selector = (String) map.get("selector");
		/*
		 * System.out.println(" connected to jms 'CUSTOM' services " +
		 * req.getRequestURI() + " Broadcaster Id :" + r.getBroadcaster() +
		 * "\t selector :" + selector + "\t Broadcaster Id :" + broadcasterId);
		 */

		if (req.getMethod().equalsIgnoreCase("GET")) {
			r.suspend();
		}

		if (req.getMethod().equalsIgnoreCase("POST")) {
			String msg = req.getReader().readLine().trim();
			System.out.println("---AletsAtmosphereHandler POST :" + msg);

			r.getBroadcaster().broadcast(msg);
		}
	}

	public void onStateChange(AtmosphereResourceEvent event) throws IOException {
		AtmosphereResource r = event.getResource();
		AtmosphereResponse res = r.getResponse();

		if (r.isSuspended()) {
			String body = event.getMessage().toString();
			res.getWriter().write(body);
			/*
			 * System.out.println("----onStateChange :" + r.transport() +
			 * "\t counter :" + counter);
			 */

			counter += 1L;
		}
		switch (r.transport()) {
		case JSONP:
		case LONG_POLLING:
			event.getResource().resume();
			break;
		case WEBSOCKET:
		case SSE:
		case STREAMING:
			res.getWriter().flush();
			/*
			 * default: if (event.isResuming()) return;
			 * event.broadcaster().broadcast("Test Message").toString();
			 */
		}
	}
}
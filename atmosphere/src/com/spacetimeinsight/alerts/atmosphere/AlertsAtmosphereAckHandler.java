package com.spacetimeinsight.alerts.atmosphere;

import java.io.IOException;

import org.atmosphere.config.service.AtmosphereHandlerService;
import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.DefaultBroadcaster;

@AtmosphereHandlerService(path = "/ack")
public class AlertsAtmosphereAckHandler implements AtmosphereHandler {
	public void destroy() {
	}

	public void onRequest(AtmosphereResource r) throws IOException {
		AtmosphereRequest req = r.getRequest();
		System.out.println(" AlertsAtmosphereAckHandler onRequest "
				+ req.getRequestURI() + " B Id :" + r.getBroadcaster());

		if (req.getMethod().equalsIgnoreCase("GET")) {
			System.out.println("---AletsAtmosphereAckHandler GET");
			r.setBroadcaster(BroadcasterFactory.getDefault().lookup(
					DefaultBroadcaster.class, "/ack", true));

			r.suspend();
		}

		if (req.getMethod().equalsIgnoreCase("POST")) {
			String msg = req.getReader().readLine().trim();
			System.out.println("---AletsAtmosphereAckHandler POST :" + msg);

			((DefaultBroadcaster) BroadcasterFactory.getDefault().lookup(
					DefaultBroadcaster.class, "/ack", true)).broadcast(msg);
		}
	}

	public void onStateChange(AtmosphereResourceEvent event) throws IOException {
		AtmosphereResource r = event.getResource();
		AtmosphereResponse res = r.getResponse();

		if (r.isSuspended()) {
			String body = event.getMessage().toString();
			res.getWriter().write(body);
			System.out.println("----Ack onStateChange :" + r.transport()
					+ "\t body :" + body + "\t B Id :"
					+ r.getBroadcaster().getID());
		}
		switch (r.transport()) {
		case JSONP:
		case LONG_POLLING:
			event.getResource().resume();
			break;
		case WEBSOCKET:
		case STREAMING:
			res.getWriter().flush();
		default:
			if (event.isResuming())
				return;
			event.broadcaster().broadcast("Test Message").toString();
		}
	}
}
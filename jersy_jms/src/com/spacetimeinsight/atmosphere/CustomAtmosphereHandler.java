package com.spacetimeinsight.atmosphere;

import java.io.IOException;
import java.util.Map;

import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.Destination;
import javax.jms.Message;
import javax.jms.MessageConsumer;
import javax.jms.Session;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;

import org.apache.activemq.ActiveMQConnection;
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
		/*System.out.println(" connected to jms 'CUSTOM' services "
				+ req.getRequestURI() + " Broadcaster Id :" + r.getBroadcaster()
				+ "\t selector :" + selector + "\t Broadcaster Id :" + broadcasterId);*/

		if (!(registered)) {
			System.out.println(" registered one consumer ");
			registered = true;
			/*try {
				JMSMessageListener listener = new JMSMessageListener(broadcasterId);
				Context ctx = new InitialContext();
				ConnectionFactory connectionFactory = (ConnectionFactory) ctx
						.lookup("java:comp/env/jms/ConnectionFactory");
				Topic topic = (Topic) ctx
						.lookup("java:comp/env/jms/AlertMessagingTopic");
				Connection connection = connectionFactory.createConnection();
				connection.start();
				Session consumerSession = connection.createSession(false, 1);

				MessageConsumer consumer = consumerSession.createConsumer(
						topic, selector);
				consumer.setMessageListener(listener);
			} catch (Exception e) {
				e.printStackTrace();
			}*/
			createConsumer(null, broadcasterId);

		}

		if (req.getMethod().equalsIgnoreCase("GET")) {
			r.suspend();
		}

		if (req.getMethod().equalsIgnoreCase("POST")) {
			String msg = req.getReader().readLine().trim();
			System.out.println("---AletsAtmosphereHandler POST :" + msg);

			r.getBroadcaster().broadcast(msg);
		}
	}
	
	public void createConsumer(String url, String broadcasterId){
		try{
			JMSMessageListener listener = new JMSMessageListener(broadcasterId);
			ActiveMQConnection connection = ActiveMQConnection.makeConnection("tcp://localhost:61616");
	        connection.start();
	        Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
	        Destination destination = session.createTopic("AlertMessagingTopic");
	        MessageConsumer consumer = session.createConsumer(destination);
	        consumer.setMessageListener(listener);
	        
		}catch(Exception e){
			e.printStackTrace();
		}		
	}
	
	public void onStateChange(AtmosphereResourceEvent event) throws IOException {
		AtmosphereResource r = event.getResource();
		AtmosphereResponse res = r.getResponse();

		if (r.isSuspended()) {
			String body = event.getMessage().toString();
			res.getWriter().write(body);
			/*System.out.println("----onStateChange :" + r.transport()
					+ "\t counter :" + counter);*/

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
		/*default:
			if (event.isResuming())
				return;
			event.broadcaster().broadcast("Test Message").toString();*/
		}
	}
}
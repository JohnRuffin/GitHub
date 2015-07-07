package com.spacetimeinsight.atmosphere;

import java.util.ArrayList;
import java.util.List;
import java.util.TimerTask;
import javax.jms.Connection;
import javax.jms.ConnectionFactory;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;
import javax.jms.Topic;
import javax.naming.Context;
import javax.naming.InitialContext;
import org.codehaus.jackson.map.ObjectMapper;

public class CustTimer extends TimerTask {
	private String broadcasterId;
	private int series;
	private int samples;
	MessageProducer publisher = null;
	Session pSession = null;
	long count = 1;

	public CustTimer(String pUid, int nSeries, int nSamples) {
		this.broadcasterId = pUid;
		this.series = nSeries;
		this.samples = nSamples;
		try {
			Context ctx = new InitialContext();
			ConnectionFactory connectionFactory = (ConnectionFactory) ctx
					.lookup("java:comp/env/jms/ConnectionFactory");
			Topic topic = (Topic) ctx.lookup("java:comp/env/jms/AlertMessagingTopic");
			Connection connection = connectionFactory.createConnection();
			connection.start();
			this.pSession = connection.createSession(false, 1);
			this.publisher = this.pSession.createProducer(topic);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void run() {
		try {
			List returnData = new ArrayList();
			for (int i = 0; i < this.series; ++i) {
				Example ex = new Example();
				ex.setName("Message:" + count );
				ex.setCount(count);
				count++;				
				returnData.add(ex);
			}

			String jasObj = new ObjectMapper().writeValueAsString(returnData);

			TextMessage textMessage = this.pSession.createTextMessage(jasObj);
			textMessage.setStringProperty("uid", this.broadcasterId);
			this.publisher.send(textMessage);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public class Example {
		private String name;
		private long count;
		public long getCount() {
			return count;
		}

		public void setCount(long count) {
			this.count = count;
		}

		public String getName() {
			return this.name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}
}
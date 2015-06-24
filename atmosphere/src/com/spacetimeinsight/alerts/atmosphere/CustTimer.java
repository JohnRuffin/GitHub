package com.spacetimeinsight.alerts.atmosphere;

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
	private String uid;
	private int series;
	private int samples;
	MessageProducer publisher = null;
	Session pSession = null;

	public CustTimer(String pUid, int nSeries, int nSamples) {
		this.uid = pUid;
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
				ex.setName("PMU" + i + " FREQ (Hz)");
				List data = new ArrayList();
				for (int j = 0; j < this.samples; ++j) {
					data.add(Long.valueOf(Math.round(Math.random() * 1000.0D)));
				}
				ex.setData(data);
				returnData.add(ex);
			}

			String jasObj = new ObjectMapper().writeValueAsString(returnData);

			TextMessage textMessage = this.pSession.createTextMessage(jasObj);
			textMessage.setStringProperty("uid", this.uid);
			this.publisher.send(textMessage);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public class Example {
		private List<Long> data;
		private String name;

		public Example() {
			this.data = new ArrayList();
		}

		public List<Long> getData() {
			return this.data;
		}

		public void setData(List<Long> data) {
			this.data = data;
		}

		public String getName() {
			return this.name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}
}
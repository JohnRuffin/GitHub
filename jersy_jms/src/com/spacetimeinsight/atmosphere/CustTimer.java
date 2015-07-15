package com.spacetimeinsight.atmosphere;

import java.util.ArrayList;
import java.util.List;
import java.util.TimerTask;

import javax.jms.Destination;
import javax.jms.MessageProducer;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.apache.activemq.ActiveMQConnection;
import org.codehaus.jackson.map.ObjectMapper;

public class CustTimer extends TimerTask {
	private String broadcasterId;
	private int series;
	MessageProducer publisher = null;
	Session pSession = null;
	long count = 1;

	public CustTimer(String pUid, int nSeries, int nSamples) {
		this.broadcasterId = pUid;
		this.series = nSeries;
		try {
			createProducer("tcp://localhost:61616", false);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void createProducer(String url, boolean isCloseConnection){
		try{
			//get activemq connection
			ActiveMQConnection connection = ActiveMQConnection.makeConnection(url);
			System.out.println("Connection established to ActiveMQ");
			//start connection
			connection.start();
	        //create the session
	        this.pSession = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
	        System.out.println("Session started...");
	        //create destination
	        Destination destination = this.pSession.createTopic("AlertMessagingTopic");
	        System.out.println("Destination created...");
	        //create producer
	        this.publisher= this.pSession.createProducer(destination);
	        System.out.println("Producer created...");
	        //close session and connection
	        if(isCloseConnection){
	        	this.pSession.close();
	        	connection.close();
	        }	        
		}catch(Exception e){
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
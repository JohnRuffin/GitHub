package com.spacetimeinsight.atmosphere;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

public class JMSMessageListener implements MessageListener {
	@SuppressWarnings("unused")
	private String broadcasterId;

	public JMSMessageListener(String bId) {
		this.broadcasterId = bId;
	}

	public void onMessage(Message message) {
		String messageText = null;
		try {
			if (message instanceof TextMessage) {
				TextMessage objectMsg = (TextMessage) message;
				messageText = objectMsg.getText().toString();
				
				sendMessage(messageText);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendMessage(String messageText) {
		String line;
		try {
			URL url = new URL(
					"http://localhost:7001/SINotification/SINotificationHandler?message="
							+ messageText);
			BufferedReader in = new BufferedReader(new InputStreamReader(
					url.openStream()));
			line = in.readLine();

			System.out.println(line);

			in.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
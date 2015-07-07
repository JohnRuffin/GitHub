package com.spacetimeinsight.atmosphere;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import org.atmosphere.cpr.MetaBroadcaster;

public class JMSMessageListener implements MessageListener {
	@SuppressWarnings("unused")
	private String browserSessionId;

	public JMSMessageListener(String bId) {
		this.browserSessionId = bId;
	}

	public void onMessage(Message message) {
		String messageText = null;
		try {
			if (message instanceof TextMessage) {
				TextMessage objectMsg = (TextMessage) message;
				messageText = objectMsg.getText().toString();
				MetaBroadcaster.getDefault()
						.broadcastTo("/custom", messageText);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
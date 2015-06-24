package com.spacetimeinsight.alerts.atmosphere;

import javax.jms.Message;
import javax.jms.MessageListener;
import javax.jms.TextMessage;

import org.atmosphere.cpr.MetaBroadcaster;

public class AlertMessageListener implements MessageListener {
	private String id;

	public AlertMessageListener(String bId) {
		this.id = bId;
	}

	public void onMessage(Message message) {
		String messageText = null;
		try {
			if (message instanceof TextMessage) {
				TextMessage objectMsg = (TextMessage) message;
				messageText = objectMsg.getText().toString();
				MetaBroadcaster.getDefault()
						.broadcastTo("/alerts", messageText);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
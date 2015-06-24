package com.spacetimeinsight.alerts.atmosphere;

import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AppContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {

		// Your code here
		System.out.println("Atmosphere Listener has been shutdown");

	}

	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {

		// Your code here
		System.out.println("Atmosphere Listener initialized.");

		TimerTask vodTimer = new CustTimer("pid1", 100, 100);

		Timer timer = new Timer();
		timer.schedule(vodTimer, 1000, (4 * 1000));

	}

}
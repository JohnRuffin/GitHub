package com.spacetimeinsight.atmosphere;

import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AppContextListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("Atmosphere Listener has been shutdown");
	}

	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		System.out.println("Atmosphere Listener initialized.");

		TimerTask vodTimer = new CustTimer("self", 5, 1);
		System.out.println("Schedule a timer task...");
		Timer timer = new Timer();
		timer.schedule(vodTimer, 10000, (10 * 1000));
	}

}
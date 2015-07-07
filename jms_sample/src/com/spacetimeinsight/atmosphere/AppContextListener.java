package com.spacetimeinsight.atmosphere;

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

		TimerTask vodTimer = new CustTimer("self", 100, 100);
		
		System.out.println("Schedule a timer task...");
		Timer timer = new Timer();
		timer.schedule(vodTimer, 5000, (4 * 1000));

	}

}
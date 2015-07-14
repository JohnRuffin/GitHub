package com.spacetimeinsight.sse.chat;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

public class ProductApplication extends Application {
	
	public ProductApplication(){
		super();
	}

	@Override
	public Set<Class<?>> getClasses() {
		final Set<Class<?>> classes = new HashSet<Class<?>>();
		classes.add(Product.class);		
		return classes;
	}
	
}

<%@page import="org.atmosphere.cpr.*,java.util.*,com.spacetimeinsight.alerts.atmosphere.*,javax.jms.*,javax.naming.*"%>
<%!
static Timer timer=null;
%>

<%

String flag =request.getParameter("start");

/*try{
AlertMessageListener listener = new AlertMessageListener();
 Context ctx = new InitialContext();
 ConnectionFactory connectionFactory = (ConnectionFactory) ctx.lookup("java:comp/env/jms/ConnectionFactory");
Topic topic = (Topic) ctx.lookup("java:comp/env/jms/AlertMessagingTopic");
Connection connection = connectionFactory.createConnection();
connection.start();
 Session consumerSession = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
MessageConsumer consumer = consumerSession.createConsumer(topic, null);
            consumer.setMessageListener(listener);
 }catch(Exception e){
 e.printStackTrace();
 }*/
/*for(int i=0;i<10000;i++){
System.out.println("i :"+i);
MetaBroadcaster.getDefault().broadcastTo("/alerts", "hello world 0 :"+i);
 //Thread.sleep(1000);

}*/
System.out.println(" timer :"+timer +"\t action :"+flag);
if(flag!=null && flag.equals("start") && timer==null){
 timer = new Timer();
  timer.schedule(new CustTimer("jsr",5,1), 0,1000);
  System.out.println(" inside timer start :"+timer +"\t action :"+flag);
  }else{
	  if(timer!=null) {
	  System.out.println(" inside timer stop :"+timer +"\t action :"+flag);
		 timer.cancel();
		timer.purge();
		timer=null;
	  }
  }

%>
done
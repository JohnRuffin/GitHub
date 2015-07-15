# GitHub
Main repository

<h1>SINotification Project </h1>

<p>
SINotificationHandler: Main servlet which receives the message from consumer in SIServer & 
broadcast the same to all connected atmosphere resource
</br>
CustomAtmosphereHandler: Atmosphere Handler 
</p>



<h1>SIServer Project </h1>
<p>
SIServer: Main project which produces and consumes the messages to/from Active-Mq. All those messges consumed from active mq are sent over the wire to <b>SINotificationHandler</b> servlet which in turn broadcasts the messages to connect atmosphere resources... 
</br>
JMSMessageListener: JMS consumer(listener) which is used to consume the messages and sent to SINotification war
</p>

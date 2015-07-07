Steps: 
1) Run "CMD" as Administrator
2) GOTO: cd C:\Program Files\SIServer\webapps\SIServer\pegasus\intern-libs
3) start selenium with chromedriver
4) java -jar selenium-server-standalone-2.45.0.jar  -Dwebdriver.chrome.driver='chromedriver.exe'

5) run intern 
6) GOTO: cd to C:\Program Files\SIServer\webapps\SIServer\pegasus\intern-libs
7) run the following command "intern-runner config=intern-config\intern"
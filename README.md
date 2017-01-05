#Stack Service.

A simple Stack Service webapp supporting the basic stack operations over a browser client page.


##Tools and Technologies used :
- JDK 1.8
- Apache Tomcat 8
- Apache Maven
- Eclipse IDE for development
- JAX-RS for exposing web services
- HTML, CSS, JavaScript, jQuery v2.2.4


##Steps to build and deploy the application
Simply run the `buildAndDeploy.sh` script in a system with the GIT client and Docker installed.

OR

Perform the following steps

__Pre-requisite tools/softwares:__ GIT client, Apache maven, Apache Tomcat server (or any other web server)

1. Clone the stackservice repository into your system.

  `$ git clone https://github.com/nvnkmrpdy/stackservice`
2. Enter the parent directory

  `$ cd stackservice`
3. Build and package the project to generate the war file

  `$ mvn clean package`
4. Copy the war file generated to the server deployment directory

  `$ cp target/stack.war <webapps/deployment_directory_of_your_server>`
5. Start the server and the application can be accessed via URL _http://<ip>:<port>/stack_


## Summary

The developed back-end application supports the following functionalities.

- Holds a unique stack for every new session.
- Push an integer to the stack.
- Pop the integer at the top of the stack.
- View the contents of the stack associated with the session.

In addition to the basic functionalities mentioned above, the application also

- treats application access via multiple tabs in a browser as the same session.
- tracks the session inactivity (client interaction with server) and resets the session after 5 min of inactivity.
- Uses localStorage to track the inactivity of the session irrespective of the number of tabs it's open in.
- Runs a count down timer from 01:00 at the end of 4th minute of inactivity and let the user choose to either continue or reset the current session. If no user action is performed and the count down timer hits 00:00, the client app automatically resets the current session. 
- invalidates the session on the server sided after 10 min of inactivity to avoid build up of unused sessions.
 


*********************************************************************************************************

When the user accesses the application for the first time from a new browser session, the back-end creates an empty stack and associates it with the current session.

#### View stack
- The user can view the contents of the stack associated with the current session by clicking on the _View/Refresh_ button.

#### Push
- The user can input an integer in the test-box and click on the _Push_ button.
- The client app validates if the input is a valid number and lies with in the integer range. If not, it displays the appropriate message to the user.
- If the input is valid, it invokes the push REST service and the element is pushed to the stack.
- On successful push operation, the client app displays an info message about the operation and refreshes the content of the stack displayed in the page.

#### Pop
- The user can click on the _Pop_ button to remove the element at the top of the stack.
- If the pop operation is successful, the client app displays an info message to the user notifying the number popped.
- If the pop operation is performed on an empty stack, the message _Pop operation not permitted on empty stack_ is displayed.
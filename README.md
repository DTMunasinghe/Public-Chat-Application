# Public-Chat-Application
Web chat application based on Asp.Net Core and Angular 7. Application enables authentication and authorization user (Asp.Net Core Identity, JWT, EntityFramework Core). 
Communication between chat users allow SignalR hub. Messages and User Details are stored in SqlServer database.

# Server

1). Open the package manager console and execute update-database command (Check the connection string in appsettings.json file)

2). Run the application (WebApi project should run on port 5001 (check the iisExpress applicationUrl of the launchSettings.json file))

# Client

1). Install the node module package by executing npm i command

2). Execute the npm start command

3). Open your browser on http://localhost:4200/

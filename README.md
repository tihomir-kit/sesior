Sessions, Express, SocketIO, Redis
======================

SESIOR is an AngularJS/NodeJS demo app which examplifies how sessions can be shared between NodeJS Express framework and Socket.IO using Redis for session storage.

## Installation
 * Install [Git Bash](http://msysgit.github.io/) (Windows users only)
 * Install [NodeJS](http://nodejs.org/)
 * Install [Python 2.7.*](https://www.python.org/downloads/) 
 * Run InstallNpmDependencies.sh located in the root directory of the project
   * this will install all the needed npm and bower dependencies for both SESIOR.Node and SESIOR.SPA
 * Install [Redis](http://redis.io/) ([for Windows users](https://github.com/MSOpenTech/redis/tree/2.8/bin/release))
 * Setup *SESIOR.Node/config.js* if needed
   
## Running the application   
 * Start redis-server (for Windows users *redis-X.Y/bin/release/redis-server.exe* from the downloaded zip)
 * Run RunNode.sh to start the SESIOR.Node portion of the application (uses [Nodemon](https://github.com/remy/nodemon))
 * Run RunSPA.sh to start the SESIOR.SPA portion of the application  
 * If you're running Windows, you can add SESIOR.SPA/app to IIS and run it that way
   * make sure to add your SESIOR.SPA hostname to SESIOR.Node/config.js allowed CORS origins
 * If you're running *NIX, read [this](http://stackoverflow.com/questions/17451834/angularjs-node-js-expressjs-application-integration-issue)

### Deleting node_modules directory on Windows
Not all files from node_modules in SESIOR.SPA can be deleted normally because their filenames are too long, so use ClearSpaNodeModules.bat from the project root directory to do that
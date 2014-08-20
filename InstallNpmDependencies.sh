# Install global dependencies
npm install -g yo


# Install NodeJS dependencies
cd SESIOR.Node
npm install -g nodemon express express-session cookie-parser body-parser socket.io redis connect-redis
npm install


# Install AngularJS dependencies
cd ../SESIOR.SPA
npm install -g angular-socket-io
npm install
bower install


read -p "Press [Enter] key to close this window..."
git pull;
rm -rf node_modules/;
npm install;
npm run build;
cd server;
rm -rf node_modules/;
npm install;
sudo node server.js;
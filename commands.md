Initialize node project
npm init -y

Add node_modules to .gitignore
echo /node_modules > .gitignore

Install express
npm i express

Install nodemon as a dev dependency
npm i -D nodemon

Install nodemon as a global package (might need sudo)
Install nodemon globally if you want to use it in the cli from anywhere
npm i -g nodemon

Install morgan logging middleware
npm i morgan

Add script to package.json
"start": "nodemon index.js"

npm script "start" doesn't need "run"
npm start
npm run <name-of-script>

Configure vscode with ejs
code --install-extension DigitalBrainstem.javascript-ejs-support
code --install-extension TaodongWu.ejs-snippets

Install ejs
npm i ejs

Change language mode > HTML

Install cookie-parser
npm i cookie-parser

Install all at once
npm i express ejs morgan cookie-parser

If you get the error `EADDRINUSE, Address already in use`
First you would find the PID of the process using PORT XXXX
sudo lsof -i :XXXX
This will list the PID listening on this port, once you have the PID you can terminate 
it with the following command:
kill -9 PID



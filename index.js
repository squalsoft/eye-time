const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let url;
if (process.env.NODE_ENV === 'DEV') {
  url = 'http://localhost:8080/';
} else {
  url = `file://${__dirname}/dist/index.html`;
}

console.log(url);

app.on('ready', () => {
  let window = new BrowserWindow({
    width: 500,
    height: 600
  });
  window.loadURL(url);
});

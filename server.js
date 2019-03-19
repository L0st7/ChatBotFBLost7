if (process.env.NODE_ENV !== 'production') { // Đọc biến môi trường trong file env ở local
  var env = require('node-env-file');
  env('.env');
}

var fbApi = require('facebook-chat-api');
var fs = require('fs');
var DialogflowHandle = require('./dialogflow.handle');
// import fbApi from 'facebook-chat-api';
// import fs from 'fs';
// import DialogflowHandle from './dialogflow.handle';

const readFileSestion = () => { // Hàm này để đọc file sessions đăng nhập của facebook
  try{
    const file = fs.readFileSync('appstate.json', 'utf8');
    return JSON.parse(file);
  } catch(error) {
    return null;
  }
};

const appState = readFileSestion();
const credientials = { // Tạo biến lưu sesstions, email và mật khẩu fb. (Nêu như đã có sessions và sessions vẫn còn hạn thì không đăng nhập lại)
  appState,
  email: process.env.FB_EMAIL,
  password: process.env.FB_PASSWORD
};
const dialogflowHandle = new DialogflowHandle();

fbApi(credientials, (err, api) => {
  if(err) return console.error(err);
  fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState())); // Ghi lại sessions mới sau khi đã refresh

  api.listen((err, message) => {
    dialogflowHandle.handleMessage(message.body)
      .then((data) => {
        const result = data[0].queryResult;
        api.sendMessage(result.fulfillmentText, message.threadID);
      })
      .catch((error) => {
        //api.sendMessage(message.body,message.threadID);
          api.sendMessage(`Error: ${error}`, message.threadID);
      });
  });
});
var dialogflow = require('dialogflow');
//import dialogflow from 'dialogflow';

// const config = {
//   credentials: {
//     private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
//     client_email:process.env.DIALOGFLOW_CLIENT_EMAIL
//   }
// };

class DialogflowHandle {
  constructor () {
    this.query = '';
    this.sessionClient = new dialogflow.SessionsClient({keyFilename:'chatbotbylost7-a669ac5c7f23.json'});
    this.sessionPath =
      this.sessionClient.sessionPath(
        process.env.PROJECT_DIALOGFLOW_ID,
        process.env.DIALOGFLOW_SESSION_ID,
      );
    this.request = {
      session: this.sessionPath,
      queryInput: {
        text: {
          text: '',
          languageCode: 'en-US',
        },
      },
    };
  }

  handleMessage (sentence) {
    this.request.queryInput.text.text = sentence
    return new Promise(
      (resolve, reject) => {
        this.sessionClient.detectIntent(this.request)
          .then(resolve)
          .catch(reject);
      }
    )
  }
}
module.exports = DialogflowHandle; 
const serverless = require('aws-serverless-express');
const axios      = require('axios');
const bodyParser = require('body-parser');
const express    = require('express');

const PORT = process.env.PORT;

let app = express();
let srv = null;

async function hello(req, res) {
  let msg  = {
    response_type: 'ephemeral',
    replace_original: true,
    text: 'Hello World!!!'
  };

  console.log(msg.text);
  res.status(200).json(msg);
}

function main(args) {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post('/hello', (req, res) => {
    hello(req, res);
  });

  axios.defaults.headers.post['Content-Type'] = 'application/json';

  if (PORT) {
    app.listen(PORT, () => {
      console.log(`Online: Listening on port ${PORT}`);
    });
  }
  else {
    console.log('Online: Lambda ready');
    srv = serverless.createServer(app, null);
  }
}

function lambda(event, context) {
  serverless.proxy(srv, event, context);
}

main();

exports.handler = lambda;
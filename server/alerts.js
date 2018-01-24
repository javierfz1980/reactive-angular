var http = require('http'),
    WebSocket = require('ws'),
    // wss = new WebSocketServer({ port: 3002 }),
    faker = require('faker'),
    _ = require('lodash');

function createAlert() {
  return {
    type: 'MESSAGE_RECIEVED',
    from: faker.name.findName(),
    email: faker.internet.email(),
    date: faker.date.past(1),
    message: faker.lorem.paragraph()
  };
}

function createAlerts(count) {
  var messages = [];

  _.times(count, () => messages.push(createAlert()));

  return messages;
}

module.exports = function(app) {
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  wss.on('connection', function (ws) {
    var timer;
    console.log('connection');

    ws.on('message', (message) => {
      console.log('message', message);
      ws.send('you said: ' + message);
    });

    ws.on('error', function () {
        console.log('error');
    });

    ws.on('close', function () {
      console.log('close');
      clearInterval(timer);
    });

    ws.send(JSON.stringify(createAlerts(5)));

    timer = setInterval(() => {
      const alert = JSON.stringify(createAlerts(_.random(0,3)));
      //console.log('sending: ', alert);
      //console.log('---------------------');
      ws.send(alert);
    }, 10000);
  });

  server.listen(3002, function listening() {
    console.log('WebSocket server running at %d', server.address().port);
  });
};

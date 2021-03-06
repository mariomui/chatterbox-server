/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const fs = require('fs');
const querystring = require('querystring');
const _ = require('underscore');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
};

// req type
// route the req
const messages = { results: [] };
let i = 0;
// messages.results.push({
//   username: '',
//   text: '',
//   roomname: '',
//   objectId: i,
// });
const url = require('url');

var requestHandler = function (request, response) {
  console.log(`Serving request type ${request.method} for url ${request.url}`);
  console.log(request.on.toString(), 'the request function');
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  let newMessage;
  const query = querystring.parse(request.url, null, '?');
  const domain = Object.keys(query)[0];
  var pathname = url.parse(request.url).pathname;

  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('../index.html'));
  }
  if (request.url === `${'/' + '?'}${query['/']}`) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(fs.readFileSync('../index.html'));
  }
  if (pathname.includes('client/styles/styles')) {
    response.writeHead(200, { 'Content-Type': 'text/css' });
    response.end(fs.readFileSync(`..${pathname}`));
  }
  if (pathname.includes('client') || pathname.includes('node')) {
    response.writeHead(200, { 'Content-Type': 'text/javascript' });
    response.end(fs.readFileSync(`..${pathname}`));
  }
  // GET
  if (domain === '/classes/messages') {
    if (request.method === 'GET') {
      var statusCode = 200;

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(messages));
    } else if (request.method === 'POST') {
      var statusCode = 201;

      response.writeHead(statusCode, headers);
      request.on('data', (data) => {
        newMessage = JSON.parse(data.toString());
        console.log(newMessage, '!!!');
        i++;
        _.extend(newMessage, { objectId: i });
      });
      var fark = request.on('end', () => {
        messages.results.push(newMessage);
        response.end(JSON.stringify({ objectId: i }));
        console.log('response start', response, 'response end');

        // response.end('not necessary');
      });
      // console.log('fark', fark, 'farkfark');
      // setTimeout(() => {
      //   console.log(fark._postData.text, 'async text');
      // }, 1000);
    } else if (request.method === 'OPTIONS') {
      response.writeHead(200, headers);
      response.end('OPTIONS SENT');
    } else {
      response.end('NO METHOD ROUTE FOUND');
    }
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('404 Error');
  }
  // console.log(messages);
};

module.exports.requestHandler = requestHandler;

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

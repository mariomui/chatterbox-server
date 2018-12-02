/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const querystring = require('querystring');
const _ = require('underscore');
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// req type
  // route the req
let messages = { results: [] };
let i = 0;
// messages.results.push({
//   username: '',
//   text: '',
//   roomname: '',
//   objectId: i,
// });

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  let newMessage;
  const query = querystring.parse(request.url, null, '?');

  const domain = Object.keys(query)[0];

  if ( request.url === '/') {
    response.writeHead(200, headers);
    response.end('Index Page Served');
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
      request.on('data', data => {
        newMessage = JSON.parse(data.toString());
        i++;
        _.extend(newMessage, {objectId: i});
      });
      request.on('end', () => {
        messages.results.push(newMessage);
        response.end(JSON.stringify({objectId: i}));
      });
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

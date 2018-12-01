/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const emitter = require('events');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// req type
  // route the req
let messages = { results: [] };

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  let newMessage;

  // GET
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      var statusCode = 200;
      response.writeHead(statusCode, headers); 
      response.end(JSON.stringify(messages));
    } else if (request.method === 'POST') {
      var statusCode = 201;
      response.writeHead(statusCode, headers);
      

      request.on('data', data => {
        newMessage = JSON.parse(data.toString());
      });
      
      request.on('end', () => {
        messages.results.push(newMessage);
        response.end(JSON.stringify(newMessage))
      });

    } else {
      response.end('NO METHOD ROUTE FOUND');
    }
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('404 Error');
  }

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

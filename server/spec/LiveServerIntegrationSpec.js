var request = require('request');
var expect = require('chai').expect;

describe('server', function () {
  it('should respond to GET requests for /classes/messages with a 200 status code', function (done) {
    request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function (done) {
    request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function (done) {
    request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function (done) {
    request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function (done) {
    var requestParams = {
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!',
      },
    };

    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function (done) {
    var requestParams = {
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!',
      },
    };

    request(requestParams, function (error, response, body) {
      // Now if we request the log, that message we posted should be there:
      console.log(requestParams, 'requestParams');
      request('http://127.0.0.1:3000/classes/messages', function (error, response, body) {
        console.log(body, 'console.logged the body');
        console.log(response, 'console.logged the response');
        console.log(JSON.parse(error), typeof error, 'console.logged the error');
        //body returns whatevers returned by in the url (1st param)
        var messages = JSON.parse(body).results;
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function (done) {
    request('http://127.0.0.1:3000/arglebargle', function (error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('Addtnl: Should return 200 status code when client sends OPTIONS request to server', function (done) {
    var requestParams = {
      method: 'OPTIONS',
      uri: 'http://localhost:3000/classes/messages',
    };
    request(requestParams, (error, response, body) => {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Addtnl: Should return 200 status code when client sends a GET request to the URL /', function (done) {
    var requestParams = {
      method: 'GET',
      uri: 'http://localhost:3000/',
    };

    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Addtnl: Should return true if ObjectId in the GET response exists', function (done) {
    var requestParams = {
      method: 'GET',
      uri: 'http://localhost:3000/classes/messages',
    };

    request(requestParams, (error, response, body) => {
      const message = JSON.parse(body).results;
      expect(message[0].hasOwnProperty('objectId')).to.equal(true);
      done();
    });
  });
});

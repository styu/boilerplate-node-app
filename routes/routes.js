var mongoose = require('mongoose');

// Uncomment the code below to use mongoose + MongoDB
// Make sure mongo is running before you start the server!

/*
// DATABASE CONNECTION
mongoose.connect('mongodb://localhost/test');

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  mongoose.connect('mongodb://localhost/test');
});

// Sample Schema
var SampleModel = require('../models/sample')(mongoose);

// END DATABASE

// Route to test database
exports.testDatabase = function(req, res) {
  var example = new SampleModel({text: "This is a test."});
  example.save(function(err) {
    if (err) {
      res.render('index.html', {text: err});
    } else {
      res.render('index.html', {text: example.text});
    }
  });
}
*/

exports.index = function(req, res) {
  res.render('index.html', {text: "Hello World"});
}

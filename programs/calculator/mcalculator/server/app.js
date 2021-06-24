var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');

//var indexRouter = require('./routes/index');

var app = express();

app.use(compression())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
express.static.mime.types['wasm'] = 'application/wasm';

module.exports = app;

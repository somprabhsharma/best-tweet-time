
require('./global');

//start express server
var app = rootRequire('config/express')();

//add middlewares to express
rootRequire('config/middleware')(app);

//add routes
rootRequire('app/route/base.route')(app);

//handle errors
rootRequire('app/route/handdleError')(app);

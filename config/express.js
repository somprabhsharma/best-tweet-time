'use strict';
/**
 * Here we simple start server and only expose app (express) object
 * for further processing.
 */

module.exports = function(){

    //getting instance of Express
    const app = require('express')();
    
    //Used DEBUG for loggin in console.
    const debug = require('debug')('main:express');
    const port = process.env.PORT || 4000;

    //configure the express instance
    app.set('env','development');
    app.set('views','./app/views');

    //serving static files (.html,.css,.js)
    app.use(require('express').static('./public'));

    //starting express server
    app.listen(port);
    debug(`Server running in ${app.get('env')} environment, listening on port: ${port}`);

    return app;
};


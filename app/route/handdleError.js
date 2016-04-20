'use strict';
module.exports = function(app){
    const debug = require('debug')('app:handdleError');
    
    //Error: 404
    app.use((req,res,next)=>{
       var err = new Error();
       err.message = 'Page Not Found';
       err.name = '404';
       err.status = 404;
       next(err); 
    });
    
        
    // Devlopment error handler
    if (app.get('env') === 'development') {        
        app.use(function(err,req,res){
            debug(`Error status: ${err.status} | message: ${err.message}`);
            res.status(err.status || 500);
            res.render('error.jade', {
            message: err.message,
            error: err
            });			
            
        });
        
    }else {
    // Production error handler
        app.use(function(err, req, res) {
            debug(`Error status: ${err.status} | message: ${err.message}`);
            res.status(err.status || 500);
            res.render('error.jade', {
            message: err.message,
            error: {}
            });
            
        });
        
    }

};
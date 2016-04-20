'use strict';


module.exports = function(app){
    const bodyParser = require('body-parser'),
          logger = require('morgan'),
          cors = require('cors');

    //Access-Cross-Site-Ogirin
    app.use(cors());
    
    //throws 400 error to next, if JSON is not valid 
    app.use(bodyParser.json({
        strict:true,
        })); 
        
    //parses the url encoded strings    
    app.use(bodyParser.urlencoded({
        extended:true,
        }));
    
   
    //logs incoming request in dev pattern 
    app.use(logger('dev'));
};


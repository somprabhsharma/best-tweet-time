'use strict';

const route = function(app){
    const twitter = rootRequire('app/controller/twitter.controller');
    
    app.get('/',(req,res)=>{
        res.redirect('/index.html');
    });
    
    app.post('/getBestTime',twitter.getBestTime);
    app.post('/getTweets',twitter.getTweets);

};

module.exports = route;

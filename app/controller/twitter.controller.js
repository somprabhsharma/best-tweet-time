'use strict';

module.exports = (function(){
        //declaring variables
        const Twit = require('twit'),
            async =  require('async'),
            debug = require('debug')('main:twitter'),
            helper = rootRequire('app/controller/twitter.helper'),
            that={},
            
            //intializing TWIT library and setting consumer key for each request
            T = new Twit(rootRequire('config/config'));
        
        //function to get the best time to tweet  
        that.getBestTime = function(req,res,next){
            let tweets=[];
            let responseTest = {};
            var reqString = {};
            
            if(req.body.data.username !== undefined && req.body.data.username.length > 0 ){
                reqString.screen_name = req.body.data.username;
            }else{
                reqString.user_id = req.body.data.userid;
            }
            
            //fetching list of followers
            T.get('followers/ids', reqString)
                  .catch(function (err) {
                  debug('Error while fetching ids');
                        next(err); 
                  })
                  .then(function (result) {
                        // limited to 10 followers only, as twitter API only allows 180 request per 15 mins
                        const users = result.data.ids.slice(0,10);
             
                        // fetching tweets for each followers        
                        async.each(users, function(item,callback){
                        T.get('statuses/user_timeline', { user_id: item, count: 200 })
                              .catch(function (err) {
                                debug('Error while fetching tweets');
                                    next(err); 
                              })
                              .then(function (result) {
                                 tweets = tweets.concat(result.data);
                                 responseTest = result;
                                 callback();
                              });
                        
                        },function(err){
                            if(err){
                                 debug('Error in final');
                                 next(err); 
                            }
                            //to check whethere rate limit has been exceeded or not
                            if(responseTest.data.errors!=undefined&&responseTest.data.errors[0].code===88){
                                debug(responseTest.data.errors[0]);
                                res.json({
                                    error:'88'
                                });
                            }else{
                                res.json(helper.bestTime(tweets));
                            }
                        }
                      );
                               
                });
        };
        
        return that;
}());
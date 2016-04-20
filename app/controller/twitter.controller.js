'use strict';

module.exports = (function(){
    
  const Twit = require('twit'),
        _data = rootRequire('data'),
        async =  require('async'),
        debug = require('debug')('main:twitter'),
        that={},
        
        T = new Twit(rootRequire('config/config'));
        var tweets=[],
            bestDay = {},
            bestTime = {},
            dayCount = new Array(7),
            timeCount = [];
        
        function initTimeCount(){
            for(var x = 0; x < 7; x++){
                timeCount[x] = [];    
                for(var y = 0; y < 24; y++){ 
                    timeCount[x][y] = 0;    
                }    
            }
        }
         
        function weekTweetCount(data){
          dayCount.fill(0);
          data.forEach(function(v,i){
            dayCount[(new Date(Date.parse(v.created_at))).getDay()] +=1;
          });
        }    
        
        function dayCounts(data){
          initTimeCount();
          data.forEach(function(v,i){
            var d = new Date(Date.parse(v.created_at));
            timeCount[d.getDay()][d.getHours()] +=1;
          });
        
        }
        
        function removeError(data){
            var temp = data.filter(function(value,index){
               if(value['errors']!==undefined){
                return false;
               }
               else if(!checkDateRange(value['created_at'])){
                return false;
               }else{
                   return true;
               }
            });
            return temp;
        }
        
        function reformat(data){
          var temp = data.map(function(v,i){
            return {
              "created_at":v.created_at,
              "favorite_count":v.favorite_count,
              "retweet_count":v.retweet_count
            };
          });
        
          return temp;
        }
        
        function checkDateRange(dateString){
            var currentDate = new Date();
            var newDate = new Date(Date.parse(dateString));
            var diff = Math.abs(currentDate - newDate)/(1000*60*60*24);
            if(diff<7){
                return true;
            }else{
                return false;
            }
        }
        
        function findMax(arr) {
            var max = {};
            max.maxValue = 0;
            max.maxIndex = 0;
            arr.forEach(function(v,i){
                if(v>max.maxValue){
                    max.maxValue = v;
                    max.maxIndex = i;
                }
             });
             return max;
        }
       
      
        that.getBestTime = function(req,res,next){
            tweets=[];
        //    debug(req.body);
            var username = req.body.data.username;
            var userid = req.body.data.userid;
            var reqString = {};
            if(username.length>0){
                reqString.screen_name = username;
            }else{
                reqString.user_id = userid;
            }
            
            //fetching list of followers
            T.get('followers/ids', reqString)
                  .catch(function (err) {
                  debug('Error while fetching ids');
                        next(err); 
                  })
                  .then(function (result) {
                
                const users = result.data.ids.slice(0,2);
             
                // fetching tweets for each followers        
                async.each(users, function(item,callback){
                      
                    T.get('statuses/user_timeline', { user_id: item, count: 200 })
                          .catch(function (err) {
                            debug('Error while fetching tweets');
                                next(err); 
                          })
                          .then(function (result) {
                             tweets = tweets.concat(result.data);
                             callback();
                          });
                    
                  },
                  function(err){

                        if(err){
                             debug('Error in final');
                             next(err); 
                        }
                        
                        var result = {};
                        tweets = reformat(removeError(tweets));
                        weekTweetCount(tweets);
                        dayCounts(tweets);
                        result.bestDay = findMax(dayCount);
                        result.bestTime = findMax(timeCount[result.bestDay.maxIndex]);
                        debug(dayCount);
                        debug(result.bestDay);
                        debug(result.bestTime);
                        res.json(result);
                      }
                  );
                               
            });
        };
        
        
        that.getTweets = function(req,res,next){
            debug(req.body);
            var username = req.body.data.username;
            var userid = req.body.data.userid;
            if(username.length>0){
                debug("true"+username);
            }else{
                debug("false"+username);
            }
            var result = {};
            tweets = reformat(removeError(_data));
            weekTweetCount(tweets);
            dayCounts(tweets);
            result.bestDay = findMax(dayCount);
            result.bestTime = findMax(timeCount[result.bestDay.maxIndex]);
            debug(dayCount);
            debug(username);
            debug(userid);
            res.json(result);
           
            /*T.get('followers/ids', { screen_name: 'nivesh002' })
                  .catch(function (err) {
                  debug('Error while fetching ids');
                        next(err); 
                  })
                  .then(function (result) {
                
                const users = result.data.ids.slice(0,10);
             
                        
                async.each(users, function(item,callback){
                      
                    T.get('statuses/user_timeline', { user_id: item, count: 10 })
                          .catch(function (err) {
                            debug('Error while fetching tweets');
                                next(err); 
                          })
                          .then(function (result) {
                             tweets = tweets.concat(result.data);
                            //tweets = result.data;
                            callback(); //required
                          });
                    
                  },
                  function(err){

                        if(err){
                             debug('Error in final');
                                next(err); 
                        }
                        tweets = reformat(removeError(tweets));
                        weekTweetCount(tweets);
                        dayCounts(tweets);
                        bestDay = findMax(dayCount);
                        bestTime = findMax(timeCount[bestDay.maxIndex])
                        debug(dayCount);
                        debug(bestDay);
                        debug(bestTime);
                        res.json(tweets);
                      }
                  );
                        
                        
                        
            });*/
            
        }
        
        return that;
}());
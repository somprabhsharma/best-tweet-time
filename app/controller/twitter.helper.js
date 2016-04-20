'use strict';

module.exports = (function(){
    const debug = require('debug')('main:helper'),
            that = {};
    var dayCount = new Array(7),
        timeCount = [];

    
        //function to create an array of array of size 7*24 and initialize elements to 0
        var _initTimeCount = function(){
            for(var x = 0; x < 7; x++){
                timeCount[x] = [];    
                for(var y = 0; y < 24; y++){ 
                    timeCount[x][y] = 0;    
                }    
            }
        };
        
        //function to count tweets day wise 
        var _weekTweetCount = function(data){
          dayCount.fill(0);
          data.forEach(function(v,i){
            dayCount[(new Date(Date.parse(v.created_at))).getDay()] +=1;
          });
        };    
        
        //function to count tweets time wise for each day
        var _dayCounts=function(data){
          _initTimeCount();
          data.forEach(function(v,i){
            var d = new Date(Date.parse(v.created_at));
            timeCount[d.getDay()][d.getHours()] +=1;
          });
        };
        
        //function to remove error data and to get data of last 7 days from the data fetched from twitter api
        var _removeError= function(data){
            var temp = data.filter(function(value,index){
               if(value['errors']!==undefined){
                return false;
               }
               else if(!_checkDateRange(value['created_at'])){
                return false;
               }else{
                return true;
               }
            });
            return temp;
        };
        
        //function to remove all other details from the data except created_at, favorite count, retweet count
        var _reformat=function(data){
          var temp = data.map(function(v,i){
            return {
              "created_at":v.created_at,
              "favorite_count":v.favorite_count,
              "retweet_count":v.retweet_count
            };
          });
          return temp;
        };
        
        //helper function for removeError() function
        var _checkDateRange = function(dateString){
            var currentDate = new Date();
            var newDate = new Date(Date.parse(dateString));
            var diff = Math.abs(currentDate - newDate)/(1000*60*60*24);
            if(diff<7){
                return true;
            }else{
                return false;
            }
        };
        
        //finding max tweet count on each day
        var _findMax=function(arr) {
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
        };
    
        that.bestTime = function(data){
            let tweets=[];
            
            tweets = _reformat(_removeError(data));
            debug('Total tweets: '+tweets.length);
            
            _weekTweetCount(tweets);
            _dayCounts(tweets);
            
            debug('DayCount: '+ dayCount);
            
            let result ={};
            
            result.bestDay = _findMax(dayCount);
            result.bestTime = _findMax(timeCount[result.bestDay.maxIndex]);
            
            debug('Result: ',result);
            
            return result;
            
        };
       
    
    
    
    return that;
})();
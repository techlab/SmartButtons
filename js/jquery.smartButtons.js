/* 
 * Smart Buttons for GitHub 1.0
 * by Dipu
 * 
 * http://www.techlaboratory.net 
 * http://tech-laboratory.blogspot.com
 * 
 * Inspired from:
 * http://markdotto.github.com/github-buttons/
 * 
 */
(function($){
    $.fn.smartButtons = function(action) {
        var options = $.extend({}, $.fn.smartButtons.defaults, action);
        
        return this.each(function(){
            var obj = $(this);
            obj.addClass('s-buttons');
            var eul = $('<ul></ul>');
            var gitUserUrl = 'https://api.github.com/users/' + options.user;
            var gitRepoUrl = 'https://api.github.com/repos/' + options.user + '/' + options.repo;
            
            // Method calling logic
            if(!action || action === 'init' || typeof action === 'object') {
              if(options.user.length>0){
                init();
              }else{
                $.error('Missing required user');
              }              
            }else{
              $.error('Method '+action+' does not exist');
            }

            function init(){
              addFollowButton();
              if(options.repo.length>0){
                addForkButton();
                addWatchButton();
              }
              obj.append(eul);
              
              // Add counts              
              if(options.followButton.count && options.followButton.show){ 
                retriveFollowCount();
              }
              if(options.repo.length>0 && (options.forkButton.count || options.watchButton.count) && (options.forkButton.show || options.watchButton.show)){ 
                retriveRepoCount();
              }
            }

            function addForkButton(){
               if(options.forkButton.show){
                var forkLI = $('<li class="fork"></li>');
                var forkText = formatTemplate(options.forkButton.text,options);
                forkLI.append($('<a class="button"><span class="icon"></span>'+forkText+'</a>'));
                eul.append(forkLI);
              }
            }
            
            function addWatchButton(){
               if(options.watchButton.show){
                var watchLI = $('<li class="watch"></li>');
                var watchText = formatTemplate(options.watchButton.text,options);
                watchLI.append($('<a class="button"><span class="icon"></span>'+watchText+'</a>'));
                eul.append(watchLI);
              }
            }
            
            function addFollowButton(){
               if(options.followButton.show){
                var followLI = $('<li class="follow"></li>');
                var followText = formatTemplate(options.followButton.text, options);
                followLI.append($('<a class="button"><span class="icon"></span>'+followText+'</a>'));
                eul.append(followLI);
              }
            }            
            
            function retriveRepoCount(){
              var watchLI = $('li.watch',obj);
              var forkLI = $('li.fork',obj);
              if(obj.data('watchers') && obj.data('forks') && options.cache){
                if(options.watchButton.count && options.watchButton.show){
                  watchLI.append('<a class="count"><span class="arrow"></span>'+obj.data('watchers')+'</a>');
                }
                if(options.forkButton.count && options.forkButton.show){
                  forkLI.append('<a class="count"><span class="arrow"></span>'+obj.data('forks')+'</a>');
                }
              }else{
                $.ajax({ url: gitRepoUrl,
                    data: {},
                    dataType: "jsonp",
                    success: function(json) {
                              if(json.data){
                                if(options.watchButton.count && options.watchButton.show){
                                  watchLI.append('<a class="count"><span class="arrow"></span>'+json.data.watchers+'</a>');
                                }                                
                                if(options.forkButton.count && options.forkButton.show){
                                  forkLI.append('<a class="count"><span class="arrow"></span>'+json.data.forks+'</a>');
                                }                                
                                obj.data('forks',json.data.forks);
                                obj.data('watchers',json.data.watchers);
                              }
                    },
                    error: function(msg) {
                      $.error('Repo Count Error: '+msg);
                    }
                });
              }
            }
            
            function retriveFollowCount(){
              var followLI = $('li.follow',obj);
              if(obj.data('followers') && options.cache){
                followLI.append('<a class="count"><span class="arrow"></span>'+obj.data('followers')+'</a>');
              }else{
                $.ajax({ url: gitUserUrl,
                    data: {},
                    dataType: "jsonp",
                    success: function(json) {
                              if(json.data){
                                followLI.append('<a class="count"><span class="arrow"></span>'+json.data.followers+'</a>');
                                obj.data('followers',json.data.followers);
                              }
                    },
                    error: function(msg) {
                      $.error('Follow Count Error: '+msg);
                    }
                });
              }
            }
            
            function formatTemplate(str, n){
              resStr = str.split("{");
              var finalStr = '';
              for(i=0;i<resStr.length;i++){
                var tmpStr = resStr[i];
                valRef = tmpStr.substring(0, tmpStr.indexOf("}")); 
                if(valRef!='' || valRef!=null){
                  var valRep = n[valRef];
                  if(valRep==null || valRep== 'undefined'){
                     valRep = '';
                  }
                  tmpStr = tmpStr.replace(valRef+'}',valRep);
                  finalStr += tmpStr;
                }else{
                  finalStr += tmpStr;
                }
              }
              return finalStr;
            }
        });
    };

    // Default Properties and Events
    $.fn.smartButtons.defaults = {
        user: '',
        repo: '',
        cache: false,
        forkButton: {'show':true, 'count':true, 'text':'Fork {repo}'},
        watchButton: {'show':true, 'count':true, 'text':'Watch {repo}'},
        followButton: {'show':true, 'count':true, 'text':'Follow {user}'}
    };

})(jQuery);
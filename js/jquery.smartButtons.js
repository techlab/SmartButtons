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
            obj.addClass('s-buttons').addClass('s-buttons-'+options.size);
            var eul = $('<ul></ul>');
            var gitUserUrl = 'https://api.github.com/users/' + options.user;
            var gitRepoUrl = 'https://api.github.com/repos/' + options.user + '/' + options.repo;
            
            var gitFollowLink = 'https://github.com/' + options.user;
            var gitRepoLink = 'https://github.com/' + options.user + '/' + options.repo;
            var gitStarLink = 'https://github.com/' + options.user + '/' + options.repo + '/stargazers';
            var gitForkLink = 'https://github.com/' + options.user + '/' + options.repo + '/network';
            
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
                addStarButton();
              }
              obj.append(eul);
              
              // Add counts              
              if(options.followButton.count && options.followButton.show){ 
                retriveFollowCount();
              }
              if(options.repo.length>0 && (options.forkButton.count || options.starButton.count) && (options.forkButton.show || options.starButton.show)){ 
                retriveRepoCount();
              }
            }

            function addForkButton(){
               if(options.forkButton.show){
                var forkLI = $('<li class="fork"></li>');
                var forkText = formatTemplate(options.forkButton.text,options);
                forkLI.append($('<a class="button" href="'+gitRepoLink+'" target="'+options.target+'"><span class="icon"></span>'+forkText+'</a>'));
                eul.append(forkLI);
              }
            }
            
            function addStarButton(){
               if(options.starButton.show){
                var starLI = $('<li class="star"></li>');
                var starText = formatTemplate(options.starButton.text,options);
                starLI.append($('<a class="button" href="'+gitRepoLink+'" target="'+options.target+'"><span class="icon"></span>'+starText+'</a>'));
                eul.append(starLI);
              }
            }
            
            function addFollowButton(){
               if(options.followButton.show){
                var followLI = $('<li class="follow"></li>');
                var followText = formatTemplate(options.followButton.text, options);
                followLI.append($('<a class="button" href="'+gitFollowLink+'" target="'+options.target+'"><span class="icon"></span>'+followText+'</a>'));
                eul.append(followLI);
              }
            }            
            
            function retriveRepoCount(){
              var starLI = $('li.star',obj);
              var forkLI = $('li.fork',obj);
              if(obj.data('watchers') && obj.data('forks') && options.cache){
                if(options.starButton.count && options.starButton.show){
                  if(options.size == 'large'){
                    starLI.prepend('<a class="count" href="'+gitStarLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('watchers')+'</a>');
                  }else{
                    starLI.append('<a class="count" href="'+gitStarLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('watchers')+'</a>');
                  }                  
                }
                if(options.forkButton.count && options.forkButton.show){
                  if(options.size == 'large'){
                    forkLI.prepend('<a class="count" href="'+gitForkLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('forks')+'</a>');
                  }else{
                    forkLI.append('<a class="count" href="'+gitForkLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('forks')+'</a>');
                  }                   
                }
              }else{
                $.ajax({ url: gitRepoUrl,
                    data: {},
                    dataType: "jsonp",
                    success: function(json) {
                              if(json.data){
                                if(options.starButton.count && options.starButton.show){                                  
                                  if(options.size == 'large'){
                                    starLI.prepend('<a class="count" href="'+gitStarLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.watchers+'</a>');
                                  }else{
                                    starLI.append('<a class="count" href="'+gitStarLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.watchers+'</a>');
                                  }                                   
                                }                                
                                if(options.forkButton.count && options.forkButton.show){
                                  if(options.size == 'large'){
                                    forkLI.prepend('<a class="count" href="'+gitForkLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.forks+'</a>');
                                  }else{
                                    forkLI.append('<a class="count" href="'+gitForkLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.forks+'</a>');
                                  }                                  
                                }                                
                                obj.data('forks',json.data.forks);
                                obj.data('watchers',json.data.starers);
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
                if(options.size == 'large'){
                  followLI.prepend('<a class="count" href="'+gitFollowLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('followers')+'</a>');
                }else{
                  followLI.append('<a class="count" href="'+gitFollowLink+'" target="'+options.target+'"><span class="arrow"></span>'+obj.data('followers')+'</a>');
                }                
              }else{
                $.ajax({ url: gitUserUrl,
                    data: {},
                    dataType: "jsonp",
                    success: function(json) {
                              if(json.data){
                                if(options.size == 'large'){
                                  followLI.prepend('<a class="count" href="'+gitFollowLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.followers+'</a>');
                                }else{
                                  followLI.append('<a class="count" href="'+gitFollowLink+'" target="'+options.target+'"><span class="arrow"></span>'+json.data.followers+'</a>');
                                }                                 
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
        size:'large', // small, medium, large
        cache: false,
        target:'_blank',
        forkButton: {'show':true, 'count':true, 'text':'Fork {repo}'},
        starButton: {'show':true, 'count':true, 'text':'Star {repo}'},
        followButton: {'show':true, 'count':true, 'text':'Follow {user}'}
    };

})(jQuery);
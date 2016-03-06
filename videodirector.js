/**
 * VideoAction class
 *
 * @constructor
 */
function VideoAction(action, func){
  this.action = action;
  this.func = func;
}

/**
 * Get video action
 * @return {string} name of action
 */
VideoAction.prototype.getAction = function(){
  return this.action;
}

/**
 * Execute callback
 */
VideoAction.prototype.executeCallback = function(){
  return this.func.apply();
}

/**
 * Determine if action is timing action
 * @return {boolean} flag indicating if action is timing action
 */
VideoAction.prototype.isTimingAction = function(){

}

/**
 * VideoDirector class
 *
 * @param {string} videoElemId id of video element
 * @constructor
 */
function VideoDirector(videoElemId){
  // current time
  this.currentTime = 0;

  // holds our actions
  this.videoActions = [];

  // holds flag that  video has been initialised
  this.hasVideoInitialised = false;

  // get 'pointer' to video element
  this.videoElem = document.getElementById(videoElemId);

  // be sure we got an element
  if(!this.videoElem){
    throw "No element found with this id";
  }

  // be sure we are working with a video tag
  if(this.videoElem.nodeName !== 'VIDEO'){
    throw "Element is not a <video> element";
  }

  // set flag that video has initialised
  this.hasVideoInitialised = true;

  // setup video events
  this.setupEvents();
}

/**
 * Setup events
 */
VideoDirector.prototype.setupEvents = function(){
  // check if our video has initialised
  if (this.hasVideoInitialised){
    var self = this;

    /**
     * Executed when a video starts to play
     */
    this.videoElem.onplay = function(){
      self.handlePlay();
    }

    /**
     * Executed when a video pauses
     */
    this.videoElem.onpause = function(){
      self.handlePause();
    }

    /**
     * Executed when video playing position changed
     */
    this.videoElem.ontimeupdate = function(){
      // store current Time
      self.currentTime = self.videoElem.currentTime;
    }

  }else{
    throw "Video hasn't initialised";
  }
}

/**
 * Handle play action
 */
VideoDirector.prototype.handlePlay = function(){
  // get all video actions of type play
  var filteredVideoActions = this.getVideoActionsOfType('play');

  // iterate over video actions
  for(var i = 0, l = filteredVideoActions.length; i<l; i++){
      filteredVideoActions[i].executeCallback();
  }
}


/**
 * Handle pause action
 */
VideoDirector.prototype.handlePause = function(){
  // get all video actions of type play
  var filteredVideoActions = this.getVideoActionsOfType('pause');

  // iterate over video actions
  for(var i = 0, l = filteredVideoActions.length; i<l; i++){
      filteredVideoActions[i].executeCallback();
  }
}

/**
 * Get video actions
 * @return {array} video actions
 */
VideoDirector.prototype.getVideoActions = function(){
  return this.videoActions;
}

/**
 * Get video actions of type
 * @param  {string} actionType name of action type
 * @return {array}  list of videoactions of action type
 */
VideoDirector.prototype.getVideoActionsOfType = function(actionType){
  var tempVideoActions = [];

  // iterate over video actions
  for(var i = 0, l = this.getVideoActions().length; i < l; i++){
      // if we need timing actions
      if (actionType === "time"){

      // if current video action is the type we need
      }else if(this.getVideoActions()[i].getAction() === actionType){
        tempVideoActions.push(this.getVideoActions()[i]);
      };
  }

  return tempVideoActions;
}

/**
 * At <action> callback
 * @param  {string}   action that needs to be fullfilld
 * @param  {Function} callback function to call
 */
VideoDirector.prototype.at = function(action, callback){
  // create video action
  var videoAction = new VideoAction(action, callback);

  // store in videoactions list
  this.videoActions.push(videoAction);
}

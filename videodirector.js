/**
 * VideoAction class
 *
 * @constructor
 */
function VideoAction(action, func){
  // action value
  this.action = action;

  // time action needs to be executed
  this.timingAction = 0;

  // function to be called
  this.func = func;
}

/**
 * Get if action is executed
 * @return {string} name of action
 */
VideoAction.prototype.getAction = function(){
  return this.action;
}

/**
 * Return timing action
 * @return {integer} timing (seconds) when the action needs to be triggered
 */
VideoAction.prototype.getTiming = function(){
  return this.timingAction;
}

/**
 * Execute callback
 */
VideoAction.prototype.executeCallback = function(){
  // set executed flag
  this.isExecuted = true;

  // call function
  return this.func();
}

/**
 * Parse timing action
 * @param  {string} action timing action
 */
VideoAction.prototype.parseTimingAction = function(action){
  //
  // {xx}s
  var re = /(.*)s/;

  if ((m = re.exec(action)) !== null) {
    this.timingAction = parseInt(m[1]);
  }

  //
  // {xx}m
  var re = /(.*)m/;

  if ((m = re.exec(action)) !== null) {
    this.timingAction = parseInt(m[1] * 60);
  }

  //
  // {xx}m {xx}s
  var re = /(.*)m(?:\s*)(.*)s/;

  if ((m = re.exec(action)) !== null) {
    this.timingAction = parseInt(m[1] * 60) + parseInt(m[2]);
  }

  //
  // {xx}:{xx}:{xx}
  var re = /(.*)\:(.*)\:(.*)/;

  if ((m = re.exec(action)) !== null) {
    this.timingAction = parseInt(m[1] * 3600) + parseInt(m[2] * 60) + parseInt(m[3]);
    console.log(this.timingAction);
  }


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
  this.prevTime = 0;

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
     * Executed when a video ended
     */
    this.videoElem.onended = function(){
      self.handleEnding();
    }

    /**
     * Executed when video playing position changed
     */
    this.videoElem.ontimeupdate = function(){
      self.handleOnTime();
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
  // get all video actions of type pause
  var filteredVideoActions = this.getVideoActionsOfType('pause');

  // iterate over video actions
  for(var i = 0, l = filteredVideoActions.length; i<l; i++){
      filteredVideoActions[i].executeCallback();
  }
}

/**
 * Handle ending action
 */
VideoDirector.prototype.handleEnding = function(){
  // get all video actions of type ended
  var filteredVideoActions = this.getVideoActionsOfType('ended');

  // iterate over video actions
  for(var i = 0, l = filteredVideoActions.length; i<l; i++){
      filteredVideoActions[i].executeCallback();
  }
}

/**
 * Handle timing actions
 */
VideoDirector.prototype.handleOnTime = function(){

  // be sure we didn't already process this frame
  if(this.prevTime !== Math.floor(this.videoElem.currentTime)){
    // store current Time and prev time
    this.currentTime = Math.floor(this.videoElem.currentTime);
    this.prevTime = this.currentTime;

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
      // if current video action is the type we need
      if(this.getVideoActions()[i].getAction() === actionType){
        tempVideoActions.push(this.getVideoActions()[i]);
      };
  }

  return tempVideoActions;
}

/**
 * Get Time related VideoActions
 * @return {array} list of timing videoactions
 */
VideoDirector.prototype.getTimeVideoActions = function(){
  console.log(this.currentTime);
}

/**
 * At <action> callback
 * @param  {string}   action that needs to be fullfilled
 * @param  {Function} callback function to call
 */
VideoDirector.prototype.at = function(action, callback){
  // create video action
  var videoAction = new VideoAction(action, callback);

  // store in videoactions list
  this.videoActions.push(videoAction);
}

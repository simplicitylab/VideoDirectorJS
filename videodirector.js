(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.VideoDirectorJS = factory();
    }
}(this, function() {
    "use strict";

    var VideoDirectorJS = {};

  /**
   * VideoAction class
   *
   * @constructor
   */
  function VideoAction(action, func){
    var noneTimeActions = ['play', 'playing', 'pause', 'ended', 'canplay', 'volumechange'];

    // action value
    this.action = action;

    // flag to indicate if this is a timed action
    this.timedAction = false;

    // time action needs to be executed
    this.timingAction = 0;

    // function to be called
    this.func = func;

    // check if we are dealing with a timed action
    if(noneTimeActions.indexOf(action) === -1){
      // parse timing action
      var isValid = this.parseTimingAction(action);

      // if we couldn't parse this action
      if(!isValid){
        throw "Action is invalid (Correct time format?)";
      }else{
        this.timedAction = true;
      }
    }
  }

  /**
   * Get action
   * @return {string} name of action
   */
  VideoAction.prototype.getAction = function(){
    return this.action;
  }

  /**
   * Get if action is timed action
   * @return {boolean} flag indicating if this action is a timed action
   */
  VideoAction.prototype.getIsTimedAction = function(){
    return this.timedAction;
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
   * @return {boolean} flag to indicate if a time was parsed succesfully
   */
  VideoAction.prototype.parseTimingAction = function(action){
    var isValid = false;
    var m = null;

    //
    // {xx}s
    var re = /(.*)s/;

    if ((m = re.exec(action)) !== null) {
      this.timingAction = parseInt(m[1]);
      isValid = true;
    }

    //
    // {xx}m
    var re = /(.*)m/;

    if ((m = re.exec(action)) !== null) {
      this.timingAction = parseInt(m[1] * 60);
      isValid = true;
    }

    //
    // {xx}m {xx}s
    var re = /(.*)m(?:\s*)(.*)s/;

    if ((m = re.exec(action)) !== null) {
      this.timingAction = parseInt(m[1] * 60) + parseInt(m[2]);
      isValid = true;
    }

    //
    // {xx}:{xx}:{xx}
    var re = /(.*)\:(.*)\:(.*)/;

    if ((m = re.exec(action)) !== null) {
      this.timingAction = parseInt(m[1] * 3600) + parseInt(m[2] * 60) + parseInt(m[3]);
      isValid = true;
    }

    return isValid;
  }

  /**
   * Director class
   *
   * @param {string} videoElemId id of video element
   * @constructor
   */
  function Director(videoElemId){
    // current time
    this.currentTime = 0;
    this.prevTime = 0;

    // holds our actions
    this.videoActions = [];

    // holds our timed video actions
    this.timedVideoActions = [];

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
  Director.prototype.setupEvents = function(){
    // check if our video has initialised
    if (this.hasVideoInitialised){
      var self = this;

      /**
       * Executed when a video starts to play
       */
      this.videoElem.onplay = function(){
        self.handleVideoEvent('play');
      }

      /**
       * Executed when a video starts to play after having been paused or stopped for buffering
       */
      this.videoElem.onplaying = function(){
        self.handleVideoEvent('playing');
      }

      /**
       * Executed when a video pauses
       */
      this.videoElem.onpause = function(){
        self.handleVideoEvent('pause');
      }

      /**
       * Executed when a video ended
       */
      this.videoElem.onended = function(){
        self.handleVideoEvent('ended');
      }

      /**
       * Executed when the browser can start playing the movie
       */
      this.videoElem.oncanplay = function(){
        self.handleVideoEvent('canplay');
      }

      /**
       * Executed when the audio volume of a video has changed
       */
      this.videoElem.onvolumechange = function(){
        self.handleVideoEvent('volumechange');
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
   * Handle video eventName
   * @param  {string} eventName name of the event
   */
  Director.prototype.handleVideoEvent = function(eventName){
    // get all video actions of type play
    var filteredVideoActions = this.getVideoActionsOfType(eventName);

    // iterate over video actions
    for(var i = 0, l = filteredVideoActions.length; i<l; i++){
        filteredVideoActions[i].executeCallback();
    }
  }

  /**
   * Handle timing actions
   */
  Director.prototype.handleOnTime = function(){

    // be sure we didn't already process this frame
    if(this.prevTime !== Math.floor(this.videoElem.currentTime)){
      // store current Time and prev time
      this.currentTime = Math.floor(this.videoElem.currentTime);
      this.prevTime = this.currentTime;

      // get actions scheduled at this time
      var filteredVideoActions = this.getTimedVideoActionsOfTime(this.currentTime);

      // iterate over video actions
      for(var i = 0, l = filteredVideoActions.length; i<l; i++){
          filteredVideoActions[i].executeCallback();
      }
    }
  }

  /**
   * Get video actions
   * @return {array} video actions
   */
  Director.prototype.getVideoActions = function(){
    return this.videoActions;
  }

  /**
   * Get Time related VideoActions
   * @return {array} of timed videoactions
   */
  Director.prototype.getTimedVideoActions = function(){
    return this.timedVideoActions;
  }

  /**
   * Get video actions of type
   * @param  {string} actionType name of action type
   * @return {array}  list of videoactions of action type
   */
  Director.prototype.getVideoActionsOfType = function(actionType){
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
   * Get timed video actions of time
   * @param  {integer} timeSeconds time of actionType
   * @return {array} list of timed video actions
   */
  Director.prototype.getTimedVideoActionsOfTime = function(timeSeconds){
    var tempVideoActions = [];

    // iterate over video actions
    for(var i = 0, l = this.getTimedVideoActions().length; i < l; i++){
      // if the current time has an action scheduled
      if(this.getTimedVideoActions()[i].timingAction === timeSeconds){
        tempVideoActions.push(this.getTimedVideoActions()[i]);
      }
    }

    return tempVideoActions;
  }

  /**
   * Pause video
   */
  Director.prototype.playVideo = function(){
    this.videoElem.play();
  }

  /**
   * Pause video
   */
  Director.prototype.pauseVideo = function(){
    this.videoElem.pause();
  }

  /**
   * Mute video
   */
  Director.prototype.muteVideo = function(){
    if (this.videoElem.muted){
      this.videoElem.muted = false;
    }else{
      this.videoElem.muted = true;
    }
  }

  /**
   * Get current time
   * @return {integer} current position video (in seconds)
   */
  Director.prototype.getCurrentTime = function(){
    return this.currentTime;
  }


  /**
   * At <action> callback
   * @param  {string}   action that needs to be fullfilled
   * @param  {Function} callback function to call
   */
  Director.prototype.at = function(action, callback){
    // create video action
    var videoAction = new VideoAction(action, callback);

    // when action is a timed action
    if(videoAction.getIsTimedAction()){
      // store in our list of timed actions
      this.timedVideoActions.push(videoAction);
    } else {
      // store in videoactions list
      this.videoActions.push(videoAction);
    }
  }



  VideoDirectorJS.Director = Director;
  VideoDirectorJS.VideoAction = VideoAction;

  return VideoDirectorJS;
}));

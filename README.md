# VideoDirectorJS

VideoDirectJS is a javascript library that makes it possible to link HTML5 video events/timing to your own (custom) callbacks.

## Loading support

* Classic loading. Loading through script src, objects accessible through VideoDirectJS namespace.
* AMD/Require.JS

## Usage

### Initialisation


```html
<video id="video-player" width="320" height="240" controls>
	<source src="video.mp4" type="video/mp4">
	Your browser does not support the video tag.
</video>
```

```javascript
var videoDirector = new VideoDirectorJS.Director('video-player');
```

### Schedule event

```javascript
// callback will be executed when video plays
videoDirector.at('play', function(){
  console.log('Video plays');
});

// callback will be executed when video is paused
videoDirector.at('pause', function(){
  console.log('Video pauses');
});

// callback will be executed when video ended
videoDirector.at('ended', function(){
  console.log('Video ended');
});

// callback will be executed when video position is at 00:00:02
videoDirector.at('2s', function(){
  console.log('Executed at 00:00:02');
});

// callback will be executed when video position is at 00:00:15
videoDirector.at('00:00:15', function(){
  console.log('Executed at 00:00:15');
});

// callback will be executed when video position is at 00:01:00
videoDirector.at('1m', function(){
  console.log('Executed at 00:01:00');
});

// callback will be executed when video position is at 00:01:00
videoDirector.at('00:01:00', function(){
  console.log('Executed at 00:01:00');
});

```
## Methods

### Director

#### at

Schedule video event

```javascript
// schedule video event when video ended
director.at('ended', function(){
	// video ended
});
```

#### playVideo

plays video

```javascript
// plays video
director.playVideo();
```

#### pauseVideo

pause video

```javascript
// pause video
director.pauseVideo();
```

#### muteVideo

mutes video audo

```javascript
// mutes video audio
director.muteVideo();
```

#### setVolume

set video volume

```javascript
// set volume to 100%
director.setVolume(100);

// set volume to 50%
director.setVolume(50);

// set volume to 20%
director.setVolume(20);
```

#### getCurrentTime

get current time in video

```javascript
// return seeked position (seconds)
director.getCurrentTime();
```

## Events

Passed to the **at** method

### Timed events

| timed event       | description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| 1s					| Called when video is at position 0:0:1                                                            |
| 1m					| Called when video is at position 0:1:0                                                            |
| 0:1:15				| Called when video is at position 0:1:15                                                           |


### Non timed events

| even name         | description                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| play					| Executed when the video starts playing or is no longer paused                                     |
| playing				| Executed when a video starts to play after having been paused or stopped for buffering            |
| pause				| Executed when a video pauses                                                                      |
| ended 				| Executed when a video ended                                                                       |
| canplay 			| Executed when the browser can start playing the movie                                             |
| volumechange 		| Executed when the audio volume of a video has changed                                             |
| seeking     		| Executed when the user starts moving/skipping to a new position in the video                      |
| seeked      		| Executed when the user is finished moving/skipping to a new position in the video                 |


## License

GNU LESSER GENERAL PUBLIC LICENSE Version 2.1 (LGPL v2.1)

# VideoDirectorJS

VideoDirectJS is a javascript library that makes it possible to link video events/timing to your own (custom) callbacks.

## Loading support

* Classic loading. Loading through script src, objects accessible through JSCardDealer namespace.
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

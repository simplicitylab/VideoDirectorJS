# VideoDirectorJS

## Usage

### Initialisation


```html
<video id="video-player" width="320" height="240" controls>
	<source src="video.mp4" type="video/mp4">
	Your browser does not support the video tag.
</video>
```

```javascript
var videoDirector = new VideoDirector('video-player');
```

### Schedule event

```javascript
// callback will be executed when video position is at 00:00:02
videoDirector.at('2s', function(){
  console.log('Executed at 00:00:02');
});

// callback will be executed when video position is at 00:00:15
videoDirector.at('00:00:15', function(){
  console.log('Executed at 00:00:15');
});

```

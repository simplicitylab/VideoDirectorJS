/**
 * Testing videodirector exceptions
 */
QUnit.test('Test VideoDirector exceptions', function(assert) {
  //
  // None element passed
  assert.throws(
    function(){
      new VideoDirectorJS.Director('none-element')
    }, 'No element found with this id',
    'None element passed'
  );

  //
  // Wrong element passed
  assert.throws(
    function(){
      new VideoDirectorJS.Director('test-element1');
    }, 'Element is not a <video> element',
    'Wrong element passed'
  );

  //
  // Video hasn't initialised
  assert.throws(
    function(){
      var director =  new  VideoDirectorJS.Director('video-player');
      director.hasVideoInitialised = false;
      director.setupEvents();
    }, 'Video hasn\'t initialised',
    'Video hasn\'t initialised'
  );
});

/**
 * Testing video actions list
 */
QUnit.test('Test VideoDirector VideoActions list', function(assert) {
  // init video director
  var director =  new  VideoDirectorJS.Director('video-player');

  // schedule new action
  director.at('play', function(){});
  director.at('pause', function(){});
  director.at('10s', function(){});
  director.at('10s', function(){});
  director.at('10m', function(){});
  director.at('play', function(){});
  director.at('play', function(){});

  // test length
  assert.equal(director.getVideoActions().length, 4, 'Get number of video actions (length)');
  assert.equal(director.getTimedVideoActions().length, 3, 'Get number of timed video actions (length)');

  // get items
  assert.equal(director.getVideoActions()[0].getAction(), 'play', 'Expected action (play)');
  assert.equal(director.getVideoActions()[1].getAction(), 'pause', 'Expected action (pause)');
  assert.equal(director.getVideoActions()[2].getAction(), 'play', 'Expected action (play)');
  assert.equal(director.getVideoActions()[3].getAction(), 'play', 'Expected action (play)');

  // get videoactions of certain type
  assert.equal(director.getVideoActionsOfType('play').length, 3, 'Get VideoActionOfType (play: 3)');

  // get videoactions of certain time
  assert.equal(director.getTimedVideoActionsOfTime(10).length, 2, 'Get getTimedVideoActionsOfTime (10s)');
});

/**
 * Testing VideoActions
 */
QUnit.test('Test VideoActions', function(assert) {

  // create new video action
  var videoActionHello = new  VideoDirectorJS.VideoAction('play', function(){
    return 'hello world'
  });

  //test get action
  assert.equal(videoActionHello.getAction(), 'play',  'Get action');

  // test callback
  assert.equal(videoActionHello.executeCallback(), 'hello world',  'Execute callback');
});

/**
 * Testing VideoActions Parse timing
 */
QUnit.test('Test VideoActions parse time', function(assert) {
  // create video action
  var videoActionHello = new  VideoDirectorJS.VideoAction('10s', function(){});

  // test {xx}s structure
  videoActionHello.parseTimingAction('0s');
  assert.equal(videoActionHello.getTiming(), 0, 'Parse timing (0s)');

  videoActionHello.parseTimingAction('10s');
  assert.equal(videoActionHello.getTiming(), 10, 'Parse timing (10s)');

  videoActionHello.parseTimingAction('100s');
  assert.equal(videoActionHello.getTiming(), 100, 'Parse timing (100s)');

  // test {xx}m structure
  videoActionHello.parseTimingAction('1m');
  assert.equal(videoActionHello.getTiming(), 60, 'Parse timing (1m)');

  videoActionHello.parseTimingAction('5m');
  assert.equal(videoActionHello.getTiming(), 300, 'Parse timing (5m)');

  // test {xx}m {xx}s structure
  videoActionHello.parseTimingAction('1m30s');
  assert.equal(videoActionHello.getTiming(), 90, 'Parse timing (1m30s)');

  // test {xx}:{xx}:{xx} structure
  videoActionHello.parseTimingAction('0:0:30');
  assert.equal(videoActionHello.getTiming(), 30, 'Parse timing (0:0:30)');

  videoActionHello.parseTimingAction('0:0:4250');
  assert.equal(videoActionHello.getTiming(), 4250, 'Parse timing (0:0:4250)');

  videoActionHello.parseTimingAction('0:00:30');
  assert.equal(videoActionHello.getTiming(), 30, 'Parse timing (0:00:30)');

  videoActionHello.parseTimingAction('00:00:40');
  assert.equal(videoActionHello.getTiming(), 40, 'Parse timing (00:00:40)');

  videoActionHello.parseTimingAction('00:0:32');
  assert.equal(videoActionHello.getTiming(), 32, 'Parse timing (00:0:32)');

  videoActionHello.parseTimingAction('0:10:00');
  assert.equal(videoActionHello.getTiming(), 600, 'Parse timing (0:10:00)');

  videoActionHello.parseTimingAction('0:10:0');
  assert.equal(videoActionHello.getTiming(), 600, 'Parse timing (0:10:0)');

  videoActionHello.parseTimingAction('00:10:0');
  assert.equal(videoActionHello.getTiming(), 600, 'Parse timing (00:10:0)');

  videoActionHello.parseTimingAction('1:0:0');
  assert.equal(videoActionHello.getTiming(), 3600, 'Parse timing (1:0:0)');

  videoActionHello.parseTimingAction('1:0:10');
  assert.equal(videoActionHello.getTiming(), 3610, 'Parse timing (1:0:10)');

  // invalid parsing
  var isValid = videoActionHello.parseTimingAction('invalid');
  assert.equal(isValid, false, 'Invalid parsing flag');

  // is timed Action
  var videoActionHello2 = new VideoDirectorJS.VideoAction('10s', function(){});
  assert.equal(videoActionHello2.getIsTimedAction(), true, 'getIsTimedAction (true)');

  var videoActionHello3 = new VideoDirectorJS.VideoAction('play', function(){});
  assert.equal(videoActionHello3.getIsTimedAction(), false, 'getIsTimedAction (false)');
});

/**
 * Testing VideoActions exceptions
 */
QUnit.test('Test VideoActions exceptions', function(assert) {
  //
  // Invalid timed action
  assert.throws(
    function(){
      new VideoDirectorJS.VideoAction('invalid action', function(){});
    }, 'Action is invalid (Correct time format?)',
    'Invalid timed action passed'
  );
});

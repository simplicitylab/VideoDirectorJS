/**
 * Testing exceptions
 */
QUnit.test('Test exceptions', function(assert) {
  //
  // None element passed
  assert.throws(
    function(){
      new VideoDirector('none-element')
    }, 'No element found with this id',
    'None element passed'
  );

  //
  // Wrong element passed
  assert.throws(
    function(){
      new VideoDirector('test-element1');
    }, 'Element is not a <video> element',
    'Wrong element passed'
  );

  //
  // Video hasn't initialised
  assert.throws(
    function(){
      var director =  new VideoDirector('video-player');
      director.hasVideoInitialised = false;
      director.setupEvents();
    }, 'Video hasn\'t initialised',
    'Video hasn\'t initialised'
  );
});

/**
 * Testing VideoActions
 */
QUnit.test('Test VideoActions', function(assert) {

  // create new video action
  var videoActionHello = new VideoAction('play', function(){
    return 'hello world'
  });

  //test get action
  assert.equal(videoActionHello.getAction(), 'play',  'Get action');

  // test callback
  assert.equal(videoActionHello.executeCallback(), 'hello world',  'Execute callback');
});

/**
 * Testing video actions list
 */
QUnit.test('Test VideoActions list', function(assert) {
  // init video director
  var director =  new VideoDirector('video-player');

  // schedule new action
  director.at('play', function(){});
  director.at('pause', function(){});
  director.at('10s', function(){});
  director.at('10m', function(){});
  director.at('play', function(){});
  director.at('play', function(){});

  // test length
  assert.equal(director.getVideoActions().length, 6, 'Get number of video actions (length)');

  // get items
  assert.equal(director.getVideoActions()[0].getAction(), 'play', 'Expected action (play)');
  assert.equal(director.getVideoActions()[1].getAction(), 'pause', 'Expected action (pause)');
  assert.equal(director.getVideoActions()[2].getAction(), '10s', 'Expected action (10s)');
  assert.equal(director.getVideoActions()[3].getAction(), '10m', 'Expected action (10m)');
  assert.equal(director.getVideoActions()[4].getAction(), 'play', 'Expected action (play)');
  assert.equal(director.getVideoActions()[5].getAction(), 'play', 'Expected action (play)');

  // get videoactions of certain type
  assert.equal(director.getVideoActionsOfType('play').length, 3, 'Get VideoActionOfType (play: 3)');

});

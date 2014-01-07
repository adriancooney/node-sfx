# sfx
### Add some sound to your node programs
Want a notification when your node program has finished executing? Want a beep whenever your program has encountered an error? Ever just wanted your error messages read out? `node-sfx` is for you.

### Install
Install `sfx` via npm.

	npm install sfx

And require it in your program.

```js
var sfx = require("sfx");
```

### API
`sfx` aims to provide a simple, consistent, cross-platformish API for your sound effects in your node programs.

#### `sfx.play( sound [, volume, rate, callback] )`
Play a sound. `sound` is a path to a sound file or a name of sound file in the `sounds/` directory (without the extension). Specifiying "random" for the `sound` parameter plays a random sound from the library. `volume` is a number between 1-100. `rate` is the speed the sound effect is played at (experimental). And finally, `callback` is called on complete.

```js
sfx.play("/System/Library/Sounds/Ping.aiff");
sfx.play("ping");
sfx.play("ping", 100);
```

#### `sfx.say( string [, voice, callback] )` (OSX only for now)
Use text-to-speech to hear a string spoke aloud. `string` is the string to speak. `voice` is to specify a voice to speak with. Available voices (OSX only) are: Agnes, Albert, Alex, Bad News, Bahh, Bells, Boing, Bruce, Bubbles, Cellos, Deranged, Fred, Good News, Hysterical, Junior, Kathy, Pipe Organ, Princess, Ralph, Trinoids, Vicki, Victoria, Whisper, Zarvox and "random" to use a random voice.

```js
sfx.say("The human torch was denied a bank loan.");
sfx.say("The arsonist has oddly shaped feet.", "Hysterical");
sfx.say("The skeleton ran out of shampoo in the shower.", "random");
```

#### `sfx.[sound]( [volume, rate] )
Sounds in the library (without their extension) can also be called directly from the `sfx` for easy access.

```js
sfx.ping();
sfx.hero();
sfx.random(); // Play a random sound
```

### Example uses
Use `sfx` to read out your logs (but it's probably a bad idea).

	var _log = console.log; 
	console.log = function() { sfx.say(Array.prototype.join.call(arguments, ". ")); _log.apply(console, arguments); }

Make `sfx` dunk on an error.

```js
db.on("error", function(err) {
	sfx.funk(function() {
		throw err;	
	});
});
```

Have a nice alert when your script is finished running.

```js
operation.on("complete", function() {
	sfx.pop(function() {
		process.exit();	
	})
});
```

Your website's traffic is fading and every request is a good request so it should have a happy sound.

```js
app.get("/", function(req, res) {
	sfx.hero();
});
```

Got any cool examples? Submit a pull request and I'd be happy to put it here.

### TODO
* Add a little sound package manager hosted on Github so you can selectively retrieve sounds. `sfx add hooray` which adds the `hooray` sound to the global sfx sound directory. Sound files could get large and ain't nobody got time for that.

### Licensing
MIT

The sounds within the `sounds/` directory are the factory sounds provided in `/System/Library/Sounds` in OSX. I have no idea what the licensing on these sounds. If anyone can inform me of the license, it would be greatly appreciated.
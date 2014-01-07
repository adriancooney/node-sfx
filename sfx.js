var exec = require("child_process").exec,
    fs = require("fs");

const DEBUG = false;
const LIBRARY = __dirname + "/sounds/";

var sfx = {
    library: {},
    config: {},
    proc: null,

    /**
     * Play a sound.
     * @param  {String} sound  The sound file or name of sound in library
     * @param  {Number} volume Volume between 0-100
     * @param  {Number} rate   Rate at which the sound should play
     */
    play: function(sound, _volume, _rate, _callback) {
        // Sort out the arguments
        var volume, rate, callback;
        if (typeof _volume == "function") callback = _volume;
        else if (typeof _rate == "function") callback = _rate, volume = _volume;
        else volume = _volume, rate = _rate, callback = _callback;

        var config = sfx.config,
            command = config.play.command;

        // Play a random sound
        if (sound == "random") sound = Object.keys(sfx.library)[Math.floor(Math.random() * Object.keys(sfx.library).length)];

        // Volume
        if (volume && config.play.options.volume) {
            var v = config.play.options.volume;
            command += " " + sfx.format(v.syntax, {
                // Denormalize via the range
                volume: (v.range[1] - v.range[0]) * (volume / 100)
            });
        }

        // Rate
        if (rate && config.play.options.rate) command += " " + sfx.format(config.play.options.rate.syntax, {
            rate: rate
        });

        // Play the sound
        sfx.getSound(sound, function(err, path) {
            command += " " + path;

            sfx.run(command, callback);
        });
    },

    /**
     * Quick helper function to format a string of variables
     * @private
     * @param  {String} string String with variables in the form of ":varName"
     * @param  {Object} values Object containing variable values
     * @return {String}        Formatted string
     */
    format: function(string, values) {
        return string.replace(/\:(\w+)/g, function(match, value) {
            return values[value];
        });
    },

    /**
     * Retrieve and test a sound via a path or name.
     * Works kindof like `require`:
     * 	1. Check if sound is at path
     * 	2. Check if sound is in ./sound
     *
     * @param  {String}   path 	   Path or name of sound
     * @param  {Function} callback Callback with (err, soundPath)
     */
    getSound: function(path, callback) {
        fs.exists(path, function(exists) {
            // Sound exists at given path
            if (exists) callback(null, path);
            else {
                // Check if the sound is in the library
                if (sfx.library[path]) callback(null, LIBRARY + sfx.library[path]);
                else callback(new Error("Sound not found."));
            }
        });
    },

    /**
     * Say a message. Mac/Darwin only.
     * @param  {String} message Message to say aloud
     * @param  {String} voice   Voice. Accepts "random" and will play with a random voice
     */
    say: function(message, _voice, _callback) {
        var voice, callback;
        if(typeof _voice == "function") callback = _voice;
        else voice = _voice, callback = _callback;

        if(process.platform !== "darwin") return console.log("`say` is a darwin only feature. Sorry dudes.");

        var voices = "Agnes,Albert,Alex,Bad News,Bahh,Bells,Boing,Bruce,Bubbles,Cellos,Deranged,Fred,Good News,Hysterical,Junior,Kathy,Pipe Organ,Princess,Ralph,Trinoids,Vicki,Victoria,Whisper,Zarvox".split(",").map(function(v) {
            return v.toLowerCase();
        });

        if(voice == "random") voice = voices[Math.floor(Math.random() * voice.length)];
        else if(voice && voices.indexOf(voice) == -1) throw new Error("Voice does not exist!");

        sfx.run("say " + (voice ? "-v " + voice + " " : "") + message, callback);
    },

    /**
     * Run a command.
     * @param  {String} command Command string
     * @return {[type]}         [description]
     */
    run: function(command, callback) {
        DEBUG && console.log("Running command: ", command);
        sfx.stop(); // Stop any running processes
        sfx.proc = exec(command); // Execute the command

        // Add the callback
        if(callback) sfx.proc.on("exit", callback);
    },

    /**
     * Stop the current sound.
     * @return {[type]} [description]
     */
    stop: function() {
        if(sfx.proc) sfx.proc.kill("SIGKILL");
    },

    /**
     * Verify an inputted configuration.
     * @param  {Object} config
     * @return {Object}        The configuation object
     */
    verifyConfig: function(config) {
        Object.keys(config).forEach(function(command) {
            var c = config[command];

            if (!c.command) throw new Error("sfx: Bad configuration. Please specify a command attribute in the `" + command + "`");
            if (!c.options) return c.options = {};

            // Loop over the options
            Object.keys(c.options).forEach(function(option) {
                var o = c.options[option];
                if (!o.syntax) throw new Error("sfx: Bad configuration. Please specify the syntax attribute in the option `" + option + "` in the `" + command + "` command");
            });
        });

        return config;
    },

    /**
     * Initilize sfx
     * @return {sfx}
     */
    init: function() {
        // Get and verify the configuration
        try {
            sfx.config = sfx.verifyConfig(require("./platform/" + process.platform + ".json"));
        } catch (err) {
            if (err.code == "ENOENT") console.log("sfx: Platform not supported yet.");
            else {
                throw err;
            }
        }

        // Populate the library
        // Syncronous to prevent unpopulated library from being used.
        var files = fs.readdirSync(LIBRARY);

        files.forEach(function(file) {
            var split = file.split(".");
            split.pop(); // Pop off the extension

            var name = split.join(".").toLowerCase();
            sfx.library[name] = file;

            // Bind the to sfx
            sfx[name] = sfx.play.bind(sfx, name);
        });

        // Random
        sfx.random = sfx.play.bind(sfx, "random");

        return sfx;
    }
};

module.exports = sfx.init();
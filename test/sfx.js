var sfx = require("./../sfx"),
    assert = require("assert"),
    path = require("path");

/**
 * Unit testing this is hard and annoying.
 *
 * I can see it becoming an absolute cacophony of sound.
 */
describe("sfx", function() {
    describe("say", function() {
        it("should say 'something'", function() {
            sfx.say("something");
        });

        it("should say 'something' with voice bubbles", function() {
            sfx.say("something", "bubbles");
        });

        it("should say 'something' with a random voice", function() {
            sfx.say("something", "random");
        });

        it("should say 'something' with a callback", function(next) {
            sfx.say("something", "random", function() {
                next();
            });
        });
    });

    describe("play", function() {
        it("should play the sound ping", function() {
            sfx.play("ping");
        });

        it("should play the sound ping with volume", function() {
            sfx.play("ping", 10);
        });

        it("should play the sound ping with volume and rate", function() {
            sfx.play("ping", 10, 1);
        });

        it("should play a sound exposed on the sfx object", function() {
            sfx.ping();
        });

        it("should play a sound exposed on the sfx object with volume", function() {
            sfx.ping(100);
        });

        it("should play a sound exposed on the sfx object with volume and rate", function() {
            sfx.ping(10, 100);
        });

        it("should play a random sound", function() {
            sfx.play("random");
        });

        it("should play a random sound via the sfx.random function", function() {
            sfx.random();
        });

        it("should play a sound with a callback", function(next) {
            sfx.play("ping", function() {
                next();
            })
        });
    });

    describe("format", function() {
        it("should format a string", function() {
            assert(sfx.format(":volume", {
                volume: "foo"
            }) == "foo");
        });
    });

    describe("getSound", function() {
        it("should test a path to see if a sound exists at it and fail gracefully", function(next) {
            sfx.getSound("/path/lol", function(err, path) {
                assert(err !== null);
                next();
            });
        });

        it("should test a sound at a real path", function(next) {
            sfx.getSound(path.resolve(__dirname, "../sounds/Ping.aiff"), function(err, path) {
                assert(path && err == null);
                next();
            });
        });

        it("should test a sound with a name", function(next) {
            sfx.getSound("ping", function(err, path) {
                assert(path && path !== "ping" && err == null);
                next();
            });
        });
    });
});
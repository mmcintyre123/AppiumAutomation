'use strict';

require('colors');
require('chai').should();

var fs = require('fs');
var os = require('os');
var path =require('path');
var expect = require('expect.js');
var sinon = require('sinon');

describe('Recorder', function() {
    var Recorder  =  require('wd-video');
    var png = fs.readFileSync('./screenShots/test.png');

    beforeEach(function() {
        this.error = false;
        this.browser = {
            takeScreenshot: function(callback) {
                setTimeout(function() {
                    callback(this.error ? 'error' : null, png);
                }.bind(this), this.recorder_timeout);
            }.bind(this)
        };
        this.recorder_output = __dirname + '/recorder_output.mp4';
        this.recorder_dir = __dirname + '/screenshots';
        this.recorder_options = {
            fps: 15,
            tmpdir: this.recorder_dir,
            beforeSave: sinon.spy()
        };
        this.recorder_frameInterval = 1000 / this.recorder_options.fps;
        this.recorder_timeout = this.recorder_frameInterval;
        this.recorder = new Recorder(this.browser, this.recorder_options);
        this.clock = sinon.useFakeTimers();
    });

    afterEach(function() {
        this.recorder.stop();

        if (fs.existsSync(this.recorder_dir)) {
            fs.readdirSync(this.recorder_dir).forEach(function(filename) {
                fs.unlinkSync(path.join(this.recorder_dir, filename));
            }.bind(this));

            fs.rmdirSync(this.recorder_dir);
        }

        if (fs.existsSync(this.recorder_output)) {
            fs.unlinkSync(this.recorder_output);
        }

        this.clock.restore();
    });

    it('should use system\'s tmpdir to store screenshots if not specified otherwise', function() {
        var recorder = new Recorder(this.browser);
        var tmpdir = os.tmpdir();

        expect(recorder._options().tmpdir).to.contain(tmpdir);
    });

    describe('start method', function() {
        it('should capture a frame according to specified FPS', function() {

            sinon.spy(this.browser, 'takeScreenshot');

            this.recorder_timeout = this.recorder_frameInterval / 2;

            this.recorder.start();
            expect(this.browser.takeScreenshot.callCount).to.be(1);

            this.recorder_timeout = this.recorder_frameInterval * 2;
            this.clock.tick(this.recorder_frameInterval);
    
            expect(this.browser.takeScreenshot.callCount).to.be(1);

            this.clock.tick(this.recorder_frameInterval);
            expect(this.browser.takeScreenshot.callCount).to.be(2);

            this.clock.tick(this.recorder_frameInterval);
            expect(this.browser.takeScreenshot.callCount).to.be(3);
        });

        it('should make isRecording method return true', function() {
            expect(this.recorder.isRecording()).to.be(false);

            this.recorder.start();

            expect(this.recorder.isRecording()).to.be(true);
        });
    });

    describe('stop method', function() {
        it('should cancel frame capturing', function() {
            sinon.spy(this.browser, 'takeScreenshot');

            this.recorder.start();
            expect(this.browser.takeScreenshot.callCount).to.be(1);

            this.recorder.stop();
            this.clock.tick(this.recorder_frameInterval * 2);
            expect(this.browser.takeScreenshot.callCount).to.be(1);
        });

        it('should make isRecording method return false', function() {
            this.recorder.start();

            expect(this.recorder.isRecording()).to.be(true);

            this.recorder.stop();

            expect(this.recorder.isRecording()).to.be(false);
        });
    });

    describe('save method', function() {
        it('should save all frames from tmpdir to a video file', function(done) {
            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval * 5);

            expect(fs.existsSync(this.recorder_dir)).to.be(true);

            this.recorder.stop();

            this.recorder.save(this.recorder_output, function(stderr, stdout, output) {
                expect(fs.statSync(output).isFile(output)).to.be(true);

                done();
            });
        });

        it('should call options.beforeSave callback with ffmpeg as parameter', function(done) {
            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval);

            this.recorder.stop();
            this.recorder.save(this.recorder_output, function() {
                expect(this.recorder_options.beforeSave.calledOnce).to.be(true);

                done();
            }.bind(this));
        });

        it('should not erase tmpdir', function(done) {
            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval);

            this.recorder.stop();
            this.recorder.save(this.recorder_output, function() {
                expect(fs.existsSync(this.recorder_dir)).to.be(true);

                done();
            }.bind(this));
        });
    });

    describe('clear method', function() {
        it('should erase tmpdir', function() {
            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval * 2);

            this.recorder.stop();

            expect(fs.existsSync(this.recorder_dir)).to.be(true);

            this.recorder.clear();

            expect(fs.existsSync(this.recorder_dir)).to.be(false);
        });
    });

    describe('stopAndSave method', function() {
        it('should call stop, save and clear methods', function(done) {
            sinon.spy(this.recorder, 'stop');
            sinon.spy(this.recorder, 'save');
            sinon.spy(this.recorder, 'clear');

            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval);

            this.recorder.stopAndSave(this.recorder_output, function() {
                expect(this.recorder.stop.calledOnce).to.be(true);
                expect(this.recorder.save.calledOnce).to.be(true);
                expect(this.recorder.clear.called).to.be(false);
                expect(this.recorder.stop.calledBefore(this.recorder.save)).to.be(true);

                done();
            }.bind(this));
        });
    });

    describe('stopSaveAndClear method', function() {
        it('should call stop, save and clear methods', function(done) {
            sinon.spy(this.recorder, 'stop');
            sinon.spy(this.recorder, 'save');
            sinon.spy(this.recorder, 'clear');

            this.recorder.start();

            this.clock.tick(this.recorder_frameInterval);

            this.recorder.stopSaveAndClear(this.recorder_output, function() {
                expect(this.recorder.stop.calledOnce).to.be(true);
                expect(this.recorder.save.calledOnce).to.be(true);
                expect(this.recorder.clear.calledOnce).to.be(true);
                expect(this.recorder.stop.calledBefore(this.recorder.save)).to.be(true);
                expect(this.recorder.save.calledBefore(this.recorder.clear)).to.be(true);

                done();
            }.bind(this));
        });
    });

    describe('stopAndClear method', function() {
        it('should call stop and clear methods', function() {
            sinon.spy(this.recorder, 'stop');
            sinon.spy(this.recorder, 'save');
            sinon.spy(this.recorder, 'clear');

            this.recorder.start();
            this.recorder.stopAndClear();

            expect(this.recorder.save.called).to.be(false);
            expect(this.recorder.stop.calledOnce).to.be(true);
            expect(this.recorder.clear.calledOnce).to.be(true);
            expect(this.recorder.stop.calledBefore(this.recorder.clear)).to.be(true);
        });
    });
});
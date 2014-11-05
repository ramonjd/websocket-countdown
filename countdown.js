var EventEmitter = require('events').EventEmitter;
var utilities = require('./utilities');
var util = require('util');

// private
var divider = ', ',
    getRenderedDate = function(targetDate){
        var now = new Date().getTime(targetDate),
            delta = Math.abs(targetDate - now) / 1000,
            days = utilities.pad(Math.floor(delta / 86400)),
            hours = utilities.pad(Math.floor(delta / 3600) % 24),
            minutes = utilities.pad(Math.floor(delta / 60) % 60),
            seconds = utilities.pad(delta % 60),
            countdownArray = [
                (days === 1 ? days + ' day' : days + ' days'), 
                (hours === 1 ? hours + ' hour' : hours + ' hours'), 
                (minutes === 1 ? minutes + ' minute' : minutes + ' minutes'),
                (seconds === 1 ? seconds + ' second' : seconds + ' seconds'),
                ];

            return {
                delta : delta,
                date : countdownArray.join(divider)
            };
    };


function Countdown (dateStr){
    this.now = new Date().getTime();
    this.targetDate = new Date(dateStr).getTime();
    return this;
};

util.inherits(Countdown, EventEmitter);

Countdown.prototype.init = function(obj) {

    this.on('complete', function() {
        this.done();
        obj.onComplete();
    }.bind(this));

    this.on('tick', function(data) {
        obj.onTick(data);
    });

    this.rendered = getRenderedDate(this.targetDate);

    this.emit('tick', {
        value: this.rendered.date
    });

    this.timer = setInterval(this.render.bind(this), 1000);

    return this;

};

Countdown.prototype.render = function() {

   this.rendered = getRenderedDate(this.targetDate);

    if (Math.floor(this.rendered.delta) <= 0) { 
        this.emit('complete');
        
    } else {
        this.emit('tick', {
            value: this.rendered.date
        });
    }
    return this;
};


Countdown.prototype.done = function() {
    this.complete = true;
    clearInterval(this.timer);
    return this;
};


module.exports = Countdown;
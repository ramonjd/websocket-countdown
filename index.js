var express = require('express.io');
var Countdown = require('./countdown');
var app = express().http().io();

var clock = new Countdown('December 19, 2014 17:00:00');

app.set('view engine', 'jade');

app.io.route('ready', function(req) {
    clock.init({
        onTick: function(data) {
            req.io.emit('countdown', data);
        }, 
        onComplete: function(){
            req.io.emit('complete', {
                value : 'You did it cowboy!'
            });
        }
    });
});


app.get('/', function(req, res) {
  res.render('client', {});
})


app.listen(7076);
console.log('Server running at localhost:7076');
(function () {
  'use strict';
  var socket = window.io.connect(),
    countdownElement = document.querySelector('#countdown'),
    setText = function (val) {
      countdownElement.textContent = val;
    };

  // --------------- chart


  var d3 = window.d3,
    data,
    width = 650,
    barHeight = 50,
    data = {
      'units': [
        {
          'name': 'days',
          'value': 0
        },
        {
          'name': 'mins',
          'value': 0
        },
        {
          'name': 'hours',
          'value': 0
        },
        {
          'name': 'secs',
          'value': 0
        }
      ]
    },
      
    x = d3.scale.linear()
      .range([0, 600]),
      chart = d3.select('#d3')
      .attr('width', width),
      
    bar = chart.selectAll('g')
      .data(data.units)
      .enter().append('g')
      .attr('transform', function (d, i) {
        return 'translate(0,' + i * barHeight + ')';
      }),
      
    updateChart = function (obj) {
        data.units.forEach(function (item) {
          item.value = obj[item.name];
        });

        d3.selectAll('rect')
          .data(data.units)
          .transition()
          .attr('width', function (d) {
            return d.value * 10;
          });
      
          d3.selectAll('text')
          .data(data.units)
          .transition()
              .attr('x', function (d) {
      return d.value * 10 + 10;
    })
          .text(function (d) {
            return d.value;
          });
    };


  x.domain([0, d3.max(data.units, function (d) {
    return d.value;
  })]);

  chart.attr('height', barHeight * data.units.length);

  bar.append('rect')
    .attr('width', function (d) {
      return d.value;
    })
    .attr('height', barHeight - 1);

  bar.append('text')
    .attr('x', function (d) {
     return d.value * 10 + 10;
    })
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text(function (d) {
      return d.value;
    });



  // --------------- sockets
  socket.emit('ready');

  socket.on('countdown', function (data) {
    setText(data.msg);
    updateChart(data);
  });

  socket.on('complete', function (data) {
    setText(data.msg);
  });




}());
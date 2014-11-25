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
    width = 750,
    height = 350,
    barWidth = 100,
    barHeight = 100,
    data = {
      'units': [

        {
          'name': 'days',
          'value': 0
        },
        {
          'name': 'hours',
          'value': 0
        },
        
         {
          'name': 'mins',
          'value': 0
        },
        
        {
          'name': 'secs',
          'value': 0
        }
      ]
    },
      
    y = d3.scale.linear()
      .range([0, 250]),
 

      
    chart = d3.select('#d3')
      .attr('height', height),
      
    bar = chart.selectAll('g')
      .data(data.units)
      .enter().append('g')
      .attr('transform', function (d, i) {
        return 'translate(' + i * barHeight + ', 0)';
      }),
      
      updateChart = function (obj) {
        data.units.forEach(function (item) {
          item.value = obj[item.name];
        });

        d3.selectAll('rect')
          .data(data.units)
          .transition()
          .attr('height', function (d) {
            return d.value * 5;
          }).attr('width', barWidth);
      
          d3.selectAll('text')
          .data(data.units)
          .transition()
           .attr('y', function (d) {
              return d.value * 5 - 12;
            })
          .text(function (d) {
            return d.value;
          });
    };

  
  y.domain([0, d3.max(data.units, function (d) {
    return d.value;
  })]);

  chart.attr('width', (barWidth + 2) * data.units.length);

  bar.append('rect')
    .attr('height', function (d) {
      return d.value;
    })
    .attr('width', barWidth)
      .attr('x', function (d, i) {
              return 2*i;
        });

  bar.append('text')
    .attr('y', function (d) {
      return d.value - 10;
    })
    .attr('x', 35)
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
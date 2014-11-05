// extract to new module:
var utilities = {

      pad : function (n) {
        n = parseInt(n, null);
        return (n < 10 && n >= 0) ? ('0' + n) : n;
      }
};


module.exports = utilities;
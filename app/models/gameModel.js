var game = function () {
  this.data = {
    name: null,
    id: null,
    isActive:null,
    isOccupied: null
  };
  this.fill = function (info) {
    for(var prop in this.data) {
      if(this.data[prop] !== 'undefined') {
        this.data[prop] = info[prop];
      }
    }
  };
  this.getInformation = function () {
    return this.data;
  };
};

module.exports = function (info) {
  var instance = new game();
  instance.fill(info);
  return instance;
};
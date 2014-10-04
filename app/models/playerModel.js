var player = function () {
  this.data = {
    name: null,
    id: null,
    played: 0,
    won: 0,
    selected: false,
    isYours: false
  };
  this.fill = function (info) {
    for(var prop in this.data) {
      if(typeof this.data[prop] !== 'undefined' && typeof info[prop] !== 'undefined') {
        this.data[prop] = info[prop];
      }
    }
  };
  this.getInformation = function () {
    return this.data;
  };
};

module.exports = function (info) {
  var instance = new player();
  instance.fill(info);
  console.log(instance);
  return instance;
};
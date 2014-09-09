
/*
 * GET users listing.
 */

var testSchema = require('../schemas/testSchema');

exports.testList = function(req, res){
  res.send("respond with a test resource");
}

exports.showSchema = function(req, res){
  testSchema.find()
      .exec(function(err, playas) {
        if (err) {
          res.status(500).json({status: 'failure'});
        } else {
          console.log(playas);
          res.render('test/index', {
            title: 'playas',
            playas: playas
          });
        }
      });
};

exports.saveSchema = function(req, res){
  var record = new testSchema(
      {
        firstName:'Tom',
        secondName:'Araya'
      }
  );
  record.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).json({status: 'failure'});
    } else {
      res.json({status: 'success'});
    }
  });
};
exports.testIndex2 = function(req, res){
  res.render('index', { title: 'Test Express2' });
};
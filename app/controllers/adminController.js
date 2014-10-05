
/*
 * GET users listing.
 */

var adminSchema = require('../schemas/adminSchema');

exports.showSchema = function(req, res){
  adminSchema.playerSchema.find()
      .setOptions({sort:'id'})
      .exec(function(err, results){
        if(err){
          res.status(500).json({status: 'failure'});
        }else{
          console.log(results);
          res.render('admin/index', {
            title: 'results',
            results: results
          });
        }
      });
};

exports.saveSchema = function(req, res){
  var record = new adminSchema.playerSchema(
      {
        "name": "Ashish",
        "id": 'p-8',
        "position" : 0,
        "played": 0,
        "won": 0,
        "selected": false,
        "isYours": false,
        "isHidden" : true
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

exports.showModel = function(req, res){
  var dataSample = require('../dataSamples/playerDataSample');
  var testModel = require('../models/playerModel');
  for(var i in dataSample){
    console.log(testModel(dataSample[i]).getInformation());
  }
  res.json(dataSample);
};

exports.saveModelSchema = function(req, res){
  var dataSample = require('../dataSamples/gameDataSample');
  var testModel = require('../models/gameModel');

  for(var i in dataSample){
    var record = new adminSchema.gameSchema(testModel(dataSample[i]).getInformation());
    record.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).json({status: 'failure'});
      } else {
        console.log('success');
      }
    });
  }
  res.json({status: 'success'});
};

exports.showModelSchema = function(req, res){
  adminSchema.gameSchema.find()
      .setOptions({sort:'id'})
      .exec(function(err, results){
        if(err){
          res.status(500).json({status: 'failure'});
        }else{
          console.log(results);
          res.render('admin/index', {
            title: 'results',
            results: results
          });
        }
      });
};
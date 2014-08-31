
/*
 * GET users listing.
 */

exports.testList = function(req, res){
  res.send("respond with a test resource");
}

exports.testIndex = function(req, res){
  res.render('index', { title: 'Test Express' });
};

exports.testIndex2 = function(req, res){
  res.render('index', { title: 'Test Express2' });
};
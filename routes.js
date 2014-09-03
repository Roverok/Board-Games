
/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls
module.exports = function(app){
  var gameController = require('./app/controllers/gameController')
  app.get(urls.WEB.SNAKES_N_LADDERS, gameController.showSnakeAndLadders);

  var testController = require('./app/controllers/test')
  app.get(urls.WEB.TEST_INDEX, testController.testIndex);
  app.get(urls.WEB.TEST_INDEX2, testController.testIndex2);
  app.get(urls.WEB.TEST_GET, testController.testList);

}
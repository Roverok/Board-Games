
/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls
module.exports = function(app){
  var gameController = require('./app/controllers/gameController')
  app.get(urls.WEB.SNAKES_N_LADDERS, gameController.showSnakeAndLadders);

  var testController = require('./app/controllers/test')
  app.get(urls.WEB.TEST_SCHEMA, testController.showSchema);
  app.get(urls.WEB.TEST_SCHEMA2, testController.saveSchema);
  app.get(urls.WEB.TEST_MODAL, testController.showModal);
  app.get(urls.WEB.TEST_MODAL_SCHEMA, testController.showModalSchema);
  app.get(urls.WEB.TEST_MODAL_SCHEMA2, testController.saveModalSchema);
  app.get(urls.WEB.TEST_GET, testController.testList);

}
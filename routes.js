
/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls;
module.exports = function(app){
  var gameController = require('./app/controllers/gameController');
  app.get(urls.WEB.SNAKES_N_LADDERS, gameController.showSnakeAndLadders);

  var testController = require('./app/controllers/testController');
  app.get(urls.WEB.TEST_SCHEMA, testController.showSchema);
  app.get(urls.WEB.TEST_SCHEMA2, testController.saveSchema);
  app.get(urls.WEB.TEST_MODAL, testController.showModel);
  app.get(urls.WEB.TEST_MODAL_SCHEMA, testController.showModelSchema);
  app.get(urls.WEB.TEST_MODAL_SCHEMA2, testController.saveModelSchema);
  app.get(urls.WEB.TEST_GET, testController.testList);

  var adminController = require('./app/controllers/adminController');
  app.get(urls.ADMIN.SHOW_SCHEMA, adminController.showSchema);
  app.get(urls.ADMIN.SAVE_SCHEMA, adminController.saveSchema);
  app.get(urls.ADMIN.SHOW_MODAL, adminController.showModel);
  app.get(urls.ADMIN.SHOW_MODAL_SCHEMA, adminController.showModelSchema);
  app.get(urls.ADMIN.SAVE_MODAL_SCHEMA, adminController.saveModelSchema);

}
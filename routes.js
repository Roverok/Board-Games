
/*
 * GET home page.
 */

var urls = require('./app/enums/urlConstants').urls;
module.exports = function(app){
  var gameController = require('./app/controllers/gameController');
  app.get(urls.WEB.SNAKES_N_LADDERS, gameController.showSnakeAndLadders);
  app.get(urls.API.FETCH_PLAYER_LIST, gameController.fetchGamePlayers);
  app.get(urls.API.UPDATE_PLAYER_PLAYED, gameController.updatePlayerMatch);
  app.get(urls.API.UPDATE_PLAYER_WON, gameController.updatePlayerWin);
  app.get(urls.API.FETCH_GAME_LIST, gameController.fetchGameList);
  app.post(urls.API.ADD_NEW_GAME, gameController.addGameToList);
  app.post(urls.API.JOIN_GAME, gameController.joinGame);

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

};
var API_VERSION = {
  v1 : '/api/v1',
  v2 : '/api/v2',
  v3 : '/api/v3'
};

exports.urls = {
  ADMIN : {
    SHOW_SCHEMA : '/admin/show-schema-test',
    SAVE_SCHEMA : '/admin/save-schema-test',
    SHOW_MODAL_SCHEMA : '/admin/show-modal-schema-test',
    SAVE_MODAL_SCHEMA : '/admin/save-modal-schema-test',
    SHOW_MODAL : '/admin/show-modal'
  },
  API : {
    FETCH_PLAYER_LIST : API_VERSION.v1 + '/player/list',
    ADD_NEW_GAME : API_VERSION.v1 + '/game/add',
    FETCH_GAME_LIST : API_VERSION.v1 + '/game/list'
  },
  WEB : {
    SNAKES_N_LADDERS : '/snakes-n-ladders',
    TEST_SCHEMA : '/schema-test',
    TEST_SCHEMA2 : '/schema-test-2',
    TEST_MODAL_SCHEMA : '/modal-schema-test',
    TEST_MODAL_SCHEMA2 : '/modal-schema-test-2',
    TEST_MODAL : '/modal-test',
    TEST_GET : '/t/get'
  },

  VIEW : {
  }
}


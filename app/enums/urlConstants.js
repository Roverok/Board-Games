var API_VERSION = {
  v1: '/api/v1',
  v2: '/api/v2',
  v3: '/api/v3'
};

exports.urls = {
  ADMIN: {
    SHOW_SCHEMA: '/admin/show-schema-test',
    SAVE_SCHEMA: '/admin/save-schema-test',
    SHOW_MODAL_SCHEMA: '/admin/show-modal-schema-test',
    SAVE_MODAL_SCHEMA: '/admin/save-modal-schema-test',
    SHOW_MODAL: '/admin/show-modal'
  },
  API: {
    FETCH_PLAYER_LIST: API_VERSION.v1 + '/player/list',
    UPDATE_PLAYER_PLAYED: API_VERSION.v1 + '/player/played/update',
    UPDATE_PLAYER_WON: API_VERSION.v1 + '/player/won/update',
    ADD_NEW_GAME: API_VERSION.v1 + '/game/add',
    UPDATE_GAME: API_VERSION.v1 + '/game/update',
    JOIN_GAME: API_VERSION.v1 + '/game/join',
    FETCH_GAME_LIST: API_VERSION.v1 + '/game/list',
    CHECK_CHEAT_CODE: API_VERSION.v1 + '/game/cheat',
    TOGGLE_PLAYER_IN_GAME: API_VERSION.v1 + '/gamePlayer/toggle',
    FETCH_PLAYER_IN_GAME: API_VERSION.v1 + '/gamePlayer/list'
  },
  WEB: {
    SNAKES_N_LADDERS: '/snakes-n-ladders',
    TEST_SCHEMA: '/schema-test',
    TEST_SCHEMA2: '/schema-test-2',
    TEST_MODAL_SCHEMA: '/modal-schema-test',
    TEST_MODAL_SCHEMA2: '/modal-schema-test-2',
    TEST_MODAL: '/modal-test',
    TEST_GET: '/t/get'
  },

  VIEW: {
  }
}


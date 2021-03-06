import {
  CREATE_ALERT,
  DESTROY_ALERT
} from "../actions.type";

import {
  ADD_ALERT,
  REMOVE_ALERT
} from "../mutations.type";

const state = {
  alerts: []
}

const getters = {
  alerts(state) {
    return state.alerts
  }
}

const actions = {
  [CREATE_ALERT](context, [message, status]) {
    let idx = context.state.alerts.findIndex(a => a[0] == message && a[1] == status);

    if(idx == -1) { // prevent adding the same status multiple times
      context.commit(ADD_ALERT, [message, status]);
      setTimeout(
        () => context.commit(REMOVE_ALERT, message),
        700 + message.length * 75
      );
    }
  },
  [DESTROY_ALERT]({ commit }, message) {
    commit(REMOVE_ALERT, message);
  }
}

const mutations = {
  [ADD_ALERT](state, alert) {
    state.alerts.push(alert);
  },
  [REMOVE_ALERT](state, message) {
    state.alerts = state.alerts.filter(([msg, _status]) => msg != message);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
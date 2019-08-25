import {
  RoleService
} from "@/common/api.service";

import {
  FETCH_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  DESTROY_ROLE,
  CREATE_ALERT
} from "../actions.type";

import {
  SET_ROLES,
  SET_ROLE,
  ADD_ROLE,
  REMOVE_ROLE
} from "../mutations.type";

const initialState = {
  roles: [],
  new_role: {
    id: "",
    title: "",
    editing: true
  }
}

const state = { ...initialState }

const getters = {
  roles(state) {
    return state.roles;
  }
}

const actions = {
  async [FETCH_ROLES](context, node_id) {
    const { data } = await RoleService.all(node_id);
    context.commit(SET_ROLES, data);
  },
  async [CREATE_ROLE](context, params) {
    const { data } = await RoleService.create(context.getters.current_node.id, params);
    context.commit(REMOVE_ROLE, "");
    context.commit(ADD_ROLE, data);
    context.dispatch(CREATE_ALERT, ["Role added", "success"]);
  },
  async [UPDATE_ROLE](context, params) {
    const { data } = await RoleService.update(params);
    context.commit(SET_ROLE, data);
    context.dispatch(CREATE_ALERT, ["Role saved", "success"]);
  },
  async [DESTROY_ROLE](context, role) {
    await RoleService.delete(role.node_id, role.id);
    context.commit(REMOVE_ROLE, role.id);
    context.dispatch(CREATE_ALERT, ["Role deleted", "success"]);
  }
}

const mutations = {
  [SET_ROLES](state, roles) {
    state.roles = roles;
  },
  [SET_ROLE](state, role) {
    let idx = state.roles.findIndex(r => r.id == role.id);
    state.roles.splice(idx, 1, role);
  },
  [ADD_ROLE](state, role) {
    state.roles.push(role || JSON.parse(JSON.stringify(state.new_role)));
  },
  [REMOVE_ROLE](state, role_id) {
    state.roles = state.roles.filter(r => r.id != role_id);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
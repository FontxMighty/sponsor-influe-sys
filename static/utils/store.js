Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: false,
    role: "",
  },

  mutations: {
    setLogIn(state, role) {
      state.loggedIn = true;
      state.role = role;
    },
    logout(state) {
      state.loggedIn = false;
      state.role = "";
    },
  },

  actions: {
    // Check login status from the backend
    async checkLogin({ commit }) {
      try {
        const res = await fetch(window.location.origin + "/check_login");
        const data = await res.json();
        if (data.loggedIn) {
          commit("setLogIn", data.role);
        } else {
          commit("logout");
        }
      } catch (error) {
        console.error("Error during login check:", error);
        commit("logout");  // Logout in case of any error
      }
    },

    // Log out the user and reset the state
    logoutUser({ commit }) {
      commit("logout");
    },
  },

  getters: {
    // Check if user is logged in
    isLoggedIn: (state) => state.loggedIn,
    // Get user role (admin, sponsor, influencer)
    userRole: (state) => state.role,
  },
});

export default store;

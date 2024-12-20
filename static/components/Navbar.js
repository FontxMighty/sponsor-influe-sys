import store from "../utils/store.js";
const Navbar = {
  template: `    
    <header>
      <!-- fixed-top -->
      <nav class="navbar navbar-expand-lg shadow rounded m-2 p-2">
        <div class="container-fluid">
         <a class="navbar-brand" href="/">
  <img src="/static/logo.png" alt="InSync Logo" height="50" width="80" class="d-inline-block align-text-top rounded-3">
</a>

          <button class="navbar-toggler"
            type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            <ul class="navbar-nav mb-2 mb-lg-0">
              <template v-if="!isLoggedIn">
             <li class="nav-item">
              <router-link to="/login" style="background-color: #3a3a40; color: white;" class="nav-link rounded me-2">Login</router-link>
             </li>
             <li class="nav-item">
               <router-link to="/signup" style="background-color: #a4cba3; color: white;" class="nav-link rounded">Sign Up</router-link>
             </li>



              </template>
              <template v-if="userRole === 'sponsor'">
                <li class="nav-item">
                    <router-link to="/influencers" class="nav-link">Influencers</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/sponsor/dashboard" class="nav-link">Dashboard</router-link>
                </li>
              </template>
              <li v-if="userRole === 'influencer'" class="nav-item">
                  <router-link to="/influencer/dashboard" class="nav-link">Dashboard</router-link>
              </li>
              <template v-if="userRole === 'admin'">
                <li class="nav-item">
                    <router-link to="/admin/users" class="nav-link">Users</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/campaigns" class="nav-link">Campaigns</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/ad-requests" class="nav-link">Ad Requests</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/dashboard" class="nav-link">Dashboard</router-link>
                </li>
              </template>
              <li class="nav-item dropdown ms-2" v-if="isLoggedIn" >
                <a class="nav-link dropdown-header fs-2 bi bi-person-circle icon-link" data-bs-toggle="dropdown" role="button" aria-expanded="false">
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li v-if="userRole !== 'admin'"><router-link to="/profile" class="dropdown-item">Profile</router-link></li>
                  <li v-if="userRole === 'sponsor'">
                    <router-link to="/sponsor/dashboard" class="dropdown-item">Dashboard</router-link>
                  </li>
                  <li v-if="userRole === 'influencer'">
                    <router-link to="/influencer/dashboard" class="dropdown-item">Dashboard</router-link>
                  </li>
                  <li v-if="userRole === 'admin'">
                    <router-link to="/admin/dashboard" class="dropdown-item">Dashboard</router-link>
                  </li>
                  <li><router-link to="/logout" class="dropdown-item">Logout</router-link></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    `,
  computed: {
    isLoggedIn() {
      return store.getters.isLoggedIn;
    },
    userRole() {
      return store.getters.userRole;
    },
  },
  mounted() {
    store.dispatch("checkLogin");
  },
};

export default Navbar;

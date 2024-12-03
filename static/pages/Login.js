import router from "../utils/router.js";
import store from "../utils/store.js";

const Login = {
  template: `
  <div class="container mt-6" style="max-width:490px;">
        <div class="row">
            <div class="col-md-12">             
                <div class="card login-form shadow-lg" style="background-color: #f8f9fa;">
                    <div class="card-header text-center fw-bold" style="background-color: #007bff; color: white;">
                      Login
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="submitInfo">
                            <div class="form-group">
                                <div class="form-floating mt-4">
                                  <input v-model="email" type="email" class="form-control" id="email" placeholder="Enter email" name="email" required>
                                  <label for="email">Email address</label>
                                </div>

                                <div class="input-group mt-4">
                                  <div class="form-floating form-floating-group flex-grow-1">
                                    <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" id="password" placeholder="Enter Password" name="password" required>
                                    <label for="password">Password</label>
                                  </div>
                                  <span class="input-group-text" @click="togglePasswordVisibility" style="background-color: #007bff; color: white; cursor: pointer;">
                                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye-fill'"></i>
                                  </span>
                                </div>
                                <button type="submit" class="btn btn-success w-100 mt-3" @click="submitInfo" style="background-color: #28a745; border-color: #28a745;">Login</button>
                            </div>
                        </form>
                        <div class="mt-2 text-center">
                            Don't have an account? <a href="/#/signup" style="color: #007bff; text-decoration: none;">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
    };
  },
  methods: {
    async submitInfo() {
      if (!this.email || !this.password) {
        return false;
      }
      try {
        const res = await fetch(window.location.origin + "/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await res.json();
        if (res.ok) {
          store.commit("setLogIn", data.role);

          if (router.currentRoute.path !== "/") {
            router.push("/");
          }
          window.triggerToast("Login Successful!", "success");
        } else {
          window.triggerToast(data.response.errors[0], "warning");
        }
      } catch (error) {
        window.triggerToast("An error occurred. Please try again.", "danger");
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};

export default Login;

Vue.use(VueRouter);

import store from "./store.js";
import Home from "../pages/Home.js";
import Login from "../pages/Login.js";
import Signup from "../pages/Signup.js";
import Profile from "../pages/Profile.js";
import Logout from "../pages/Logout.js";

import DashboardSponsor from "../pages/sponsor/DashboardSponsor.js";
import AddCampaign from "../pages/sponsor/AddCampaign.js";
import SponsorCampaignDetails from "../pages/sponsor/SponsorCampaignDetails.js";
import SponsorAdRequest from "../pages/sponsor/SponsorAdRequest.js";
import AllInfluencers from "../pages/sponsor/AllInfluencers.js";

import DashboardInfluencer from "../pages/influencer/DashboardInfluencer.js";
import InfluencerCampaignDetails from "../pages/influencer/InfluencerCampaignDetails.js";
import InfluencerAdRequest from "../pages/influencer/InfluencerAdRequest.js";

import DashboardAdmin from "../pages/admin/DashboardAdmin.js";
import AdminUsers from "../pages/admin/AdminUsers.js";
import AdminCampaigns from "../pages/admin/AdminCampaigns.js";
import AdminAdRequests from "../pages/admin/AdminAdRequest.js";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login, meta: { requiresAuth: false } },
  { path: "/signup", component: Signup, meta: { requiresAuth: false } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/logout", component: Logout, meta: { requiresAuth: true } },
  {
    path: "/sponsor/dashboard",
    component: DashboardSponsor,
    meta: { requiresAuth: true, requiredRole: "sponsor" },
  },
  {
    path: "/sponsor/campaign/add",
    component: AddCampaign,
    meta: { requiresAuth: true, requiredRole: "sponsor" },
  },
  {
    path: "/sponsor/campaign/:id",
    component: SponsorCampaignDetails,
    meta: { requiresAuth: true, requiredRole: "sponsor" },
  },
  {
    path: `/sponsor/ad-request/:id`,
    component: SponsorAdRequest,
    meta: { requiresAuth: true, requiredRole: "sponsor" },
  },
  {
    path: `/influencers`,
    component: AllInfluencers,
    meta: { requiresAuth: true, requiredRole: "sponsor" },
  },
  {
    path: "/influencer/dashboard",
    component: DashboardInfluencer,
    meta: { requiresAuth: true, requiredRole: "influencer" },
  },
  {
    path: "/influencer/campaign/:id",
    component: InfluencerCampaignDetails,
    meta: { requiresAuth: true, requiredRole: "influencer" },
  },
  {
    path: `/influencer/ad-request/:id`,
    component: InfluencerAdRequest,
    meta: { requiresAuth: true, requiredRole: "influencer" },
  },
  {
    path: `/admin/dashboard`,
    component: DashboardAdmin,
    meta: { requiresAuth: true, requiredRole: "admin" },
  },
  {
    path: `/admin/users`,
    component: AdminUsers,
    meta: { requiresAuth: true, requiredRole: "admin" },
  },
  {
    path: `/admin/campaigns`,
    component: AdminCampaigns,
    meta: { requiresAuth: true, requiredRole: "admin" },
  },
  {
    path: `/admin/ad-requests`,
    component: AdminAdRequests,
    meta: { requiresAuth: true, requiredRole: "admin" },
  },
];

const router = new VueRouter({
  // mode: "history", // Ensure history mode is enabled
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    await store.dispatch("checkLogin");

    const isLoggedIn = store.getters.isLoggedIn;
    const userRole = store.getters.userRole;

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isLoggedIn) {
        next("/login");
      } else if (to.meta.requiredRole && to.meta.requiredRole !== userRole) {
        next("/"); // Or another page if the role does not match
      } else {
        next();
      }
    } else {
      // If the user is logged in, handle redirection based on role
      if (isLoggedIn) {
        if (userRole === "sponsor") {
          next("/sponsor/dashboard"); // Redirect to sponsor dashboard
        } else if (userRole === "influencer") {
          next("/influencer/dashboard"); // Redirect to influencer dashboard
        } else if (userRole === "admin") {
          next("/admin/dashboard"); // Redirect to admin dashboard
        } else {
          next("/"); // Default fallback
        }
      } else {
        next(); // Proceed to the route if not logged in
      }
    }
  } catch (error) {
    console.error("Error in navigation guard:", error);
    next("/login");
  }
});

export default router;

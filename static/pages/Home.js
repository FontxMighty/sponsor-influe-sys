import store from "../utils/store.js";
import Campaign from "../components/Campaign.js";
import router from "../utils/router.js";
const Home = {
  template: `
  <div class="container">
<h2 
  v-if="!isLoggedIn" 
  class="mr-50 text-center" 
  style="color: #111111; margin-top: 250px;">
  Login to view influencer and sponsorship
</h2>

    <div v-if="isLoggedIn">
      <div  class="card rounded shadow mt-4 mb-2">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="flex-grow-1">Public Campaigns</h3>
            <button class="btn btn-outline-secondary" @click="resetCampaignFilter">Clear Filter</button>
          </div>

          <div class="d-flex mb-3 row g-2">
            <div class="form-floating col-6">
              <input v-model="campaignSearchQuery" type="text" class="form-control" id="search" placeholder="Search campaigns"/>
              <label for="search">Search campaigns</label>
            </div>
            <div class="col">
              <div class="form-floating">
                <input v-model="startDate" type="date" class="form-control" id="startDate"/>
                <label for="startDate">Start Date</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating">
                <input v-model="endDate" type="date" class="form-control" id="endDate"/>
                <label for="endDate">End Date</label>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      <div class="d-flex row">
        <Campaign v-for="campaign in filteredCampaigns" :key="campaign.id" :campaign="campaign"
          class="shadow col-12 col-sm-6 col-md-6 col-lg-4 mb-2"/>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      campaigns: [],
      campaignSearchQuery: "",
      startDate: "",
      endDate: "",
    };
  },
  computed: {
    isLoggedIn() {
      return store.getters.isLoggedIn;
    },
    userRole() {
      return store.getters.userRole;
    },
    filteredCampaigns() {
      return this.campaigns.filter((campaign) => {
        const matchesSearchQuery =
          this.campaignSearchQuery === "" ||
          Object.values(campaign).some((value) =>
            String(value)
              .toLowerCase()
              .includes(this.campaignSearchQuery.toLowerCase())
          );

        const matchesStartDate =
          !this.startDate ||
          new Date(campaign.start_date) >= new Date(this.startDate);

        const matchesEndDate =
          !this.endDate ||
          new Date(campaign.end_date) <= new Date(this.endDate);

        return matchesSearchQuery && matchesStartDate && matchesEndDate;
      });
    },
  },
  beforeMount() {
    if (store.getters.userRole === "admin") {
      router.push("/admin/dashboard");
    }
  },
  mounted() {
    store.dispatch("checkLogin");
  },
  created() {
    if (this.isLoggedIn) {
      this.fetchCampaigns();
    }
  },
  components: {
    Campaign,
  },
  methods: {
    async fetchCampaigns() {
      const url = window.location.origin;
      try {
        const response = await fetch(url + "/api/campaign");
        const data = await response.json();
        this.campaigns = data;
      } catch (error) {
        window.triggerToast(error, "danger");
        // console.error("Failed to fetch campaigns:", error);
      }
    },
    resetCampaignFilter() {
      this.campaignSearchQuery = "";
      this.startDate = "";
      this.endDate = "";
    },
  },
};

export default Home;

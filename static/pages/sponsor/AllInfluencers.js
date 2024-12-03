const AllInfluencers = {
  template: `
      <div class="container mt-4">
          <div class="card rounded shadow">
              <div class="card-body">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                      <h3 class="flex-grow-1">All Influencers</h3>
                     <button class="btn btn-primary" @click="resetFilter">Clear Filter</button>

                  </div>
  
                  <div class="d-flex mb-3 row g-2">
                      <div class="form-floating col-6">
                          <input v-model="searchQuery" type="text" class="form-control" id="search" placeholder="Search influencers"/>
                          <label for="search">Search influencers</label>
                      </div>
                      
                      <div class="form-floating col">
                          <select v-model="followersFilter" class="form-select" id="filter">
                              <option value="">All</option>
                              <option value="lessthan">Less Than</option>
                              <option value="greaterthan">Greater Than</option>
                          </select>
                          <label for="filter">Followers</label>
                      </div>
                      <div v-if="followersFilter" class="form-floating col mt-4">
                          <input v-model="followerRange" type="range" min="0" :max="maxFollowers" step="500" class="form-range"/>
                          <label for="range">Followers: {{ followerRange }}</label>
                      </div>
                  </div>
              </div>
          </div>
  
          <div class="card mt-2 table-responsive">
              <table v-if="filteredInfluencers.length > 0" class="text-center rounded card-body">
                  <thead>
                      <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Niche</th>
                          <th>Followers</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="influencer in filteredInfluencers" :key="influencer.id">
                          <td>{{ influencer.id }}</td>
                          <td>{{ influencer.name }}</td>
                          <td>{{ influencer.influencer_data.category }}</td>
                          <td>{{ influencer.influencer_data.niche }}</td>
                          <td>{{ influencer.influencer_data.followers }}</td>
                      </tr>
                  </tbody>
              </table>
              <div v-else class="card-body fw-bold">No influencers found at the moment...</div>
          </div>
      </div>
    `,
  data() {
    return {
      influencers: [],
      searchQuery: "",
      followersFilter: "",
      followerRange: 0,
    };
  },
  computed: {
    filteredInfluencers() {
      return this.influencers.filter((influencer) => {
        const matchesSearch =
          this.searchQuery === "" ||
          [influencer.name, influencer.influencer_data.category, influencer.influencer_data.niche]
            .some((field) =>
              String(field).toLowerCase().includes(this.searchQuery.toLowerCase())
            );

        const followerCount = influencer.influencer_data.followers || 0;
        const matchesFollowers =
          this.followersFilter === "" ||
          (this.followersFilter === "lessthan" && followerCount <= this.followerRange) ||
          (this.followersFilter === "greaterthan" && followerCount >= this.followerRange);

        return matchesSearch && matchesFollowers;
      });
    },
    maxFollowers() {
      return this.influencers.length > 0
        ? Math.max(...this.influencers.map((i) => i.influencer_data.followers || 0)) + 500
        : 1000000;
    },
  },
  mounted() {
    this.fetchInfluencers();
  },
  methods: {
    async fetchInfluencers() {
      try {
        const response = await fetch("/api/users/all");
        if (response.ok) {
          this.influencers = await response.json();
        } else {
          window.triggerToast("Failed to fetch influencers.", "danger");
        }
      } catch (error) {
        window.triggerToast("Error fetching data: " + error.message, "danger");
      }
    },
    resetFilter() {
      this.searchQuery = "";
      this.followersFilter = "";
      this.followerRange = 0;
    },
  },
};

export default AllInfluencers;

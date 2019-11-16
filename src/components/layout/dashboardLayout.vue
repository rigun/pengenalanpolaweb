<template>
  <div class="content">
    <vue-topprogress ref="topProgress"></vue-topprogress>
    <div v-if="loading == true"></div>
    <div v-else>
      <div id="topnav" class="topnavDashboard">
        <nav class="navbar has-shadow dashnav" :class="{'showLeft': leftNav}" style="padding: 0px">
          <div class="navbar-start" style="display: flex;width: auto;">
            <div class="navbar-item box-hamburger">
              <div class="hamburger" @click.prevent="hamburger(1)">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
              </div>
            </div>
            <router-link
              :to="{name:'Landing'}"
              style="display: flex;align-items: center;margin-left: 20px;"
            >
              <div class="logoAtma nomargin nopadding mediumLogo">
                <div class="pictureLogo">
                  <img :src="require('@/assets/logoatma.png')" alt />
                </div>
                <div class="sistemName">
                  <strong>Sistem</strong>
                  <br />
                  <strong>Pengenalan</strong>
                  <br />
                  <strong>Wajah</strong>
                </div>
              </div>
            </router-link>
          </div>
        </nav>
      </div>
      <div
        class="whitespaceburger"
        :class="{'showWhiteSpace': leftNav}"
        @click.prevent="hamburger(0)"
      ></div>

      <div id="side-menu" class="side-menu" :class="{'showLeft': leftNav}">
        <aside class="menu">
          <div id="side-header" class="side-header">
            <div class="menu-label imgLabel">
              <div style="display:flex" @click.prevent="hamburger(1)">
                <div class="inisial-name">{{inisial}}</div>
                <div class="text-item">
                  <span class="mute-text nomargin">Hello</span>
                  <h2
                    class="name-text nomargin"
                    style="color: white; font-weight: bold; color: white;overflow: hidden;max-height: 23px;"
                  >{{user.name}}</h2>
                </div>
              </div>
            </div>
          </div>
          <hr class="separator-side" />
          <div class="side-body">
            <ul class="menu-list dashboardlist">
              <li @click.prevent="hamburger(0)">
                <router-link v-bind:to="{name: 'DashboardContent'}">
                  <v-icon dark style="margin-right: 15px">dashboard</v-icon>
                  <span>Dashboard</span>
                </router-link>
              </li>
              <li @click.prevent="hamburger(0)">
                <router-link v-bind:to="{name: 'Students'}">
                  <v-icon dark style="margin-right: 15px">dashboard</v-icon>
                  <span>Students</span>
                </router-link>
              </li>
              <li @click.prevent="hamburger(0)">
                <router-link v-bind:to="{name: 'Attendance'}">
                  <v-icon dark style="margin-right: 15px">dashboard</v-icon>
                  <span>Attendacne</span>
                </router-link>
              </li>
            </ul>
          </div>
          <hr class="separator-side" />
          <div class="side-body">
            <ul class="menu-list dashboardlist">
              <li @click="logoutDialog = true;">
                <router-link v-bind:to="{name: 'Logout'}">
                  <v-icon dark style="margin-right: 15px">power_settings_new</v-icon>
                  <span>Keluar</span>
                </router-link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      <div class="background-dashboard"></div>
      <div id="appDashboard">
        <main class="dashboardContent" :class="{'showLeft': leftNav}">
          <transition name="fade">
            <router-view></router-view>
          </transition>
        </main>
      </div>
    </div>
  </div>
</template>
<style >
.notifRed {
  background: #ff2b2b;
  border-radius: 100px;
  position: absolute;
  right: 4px;
  text-align: center;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  bottom: 10px;
}
</style>
<script>
import { vueTopprogress } from "vue-top-progress";
export default {
  components: {
    vueTopprogress
  },
  data() {
    return {
      user: {
        name: "Rio Gunawan"
      },
      notif: [],
      error: "",
      loading: true,
      activeFirst: false,
      wrongPassword: false,
      leftNav: false,
      showDropDown: false,
      first: 0,
      count: 0,
      logoutDialog: false
    };
  },
  mounted() {
    this.getUser();
  },
  computed: {
    inisial() {
      var initials = "";
      var names = this.user.name.split(" ");
      for (let n = 0; n < 2; n++) {
        if (n < names.length) {
          initials += names[n].substring(0, 1).toUpperCase();
        }
      }
      return initials;
    }
  },
  methods: {
    rightDropDown() {
      this.showDropDown = !this.showDropDown;
    },
    hamburger(priority) {
      if (window.innerWidth <= 800 || priority === 1) {
        this.leftNav = !this.leftNav;
      }
    },
    getUser() {
      this.$refs.topProgress.start();
      this.$http
        .get(this.$apiUrl + "/api/user", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          this.$refs.topProgress.done();
          this.loading = false;
          if (response.data.stat == 0){
            this.$router.push({ name: "Logout" });
          }else{
            this.user = response.data.msg;
          }
        })
        .catch(error => {
          this.loading = !error;
          this.$router.push({ name: "Logout" });
        });
    }
  }
};
</script>

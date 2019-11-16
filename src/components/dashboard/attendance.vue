<template id="admin-list">
  <div class="contentlist">
    <div class="flex-container">
      <div class="columns m-t-10">
        <div class="column" style="display:flex">
          <h1 class="title" style="margin-bottom: 0; margin-right: 10px;">Presensi Pengenalan Pola</h1>
          <v-icon
            @click="getData(); refresh =true"
            :style="refresh ?'transform:rotate(360deg)':'transform: none'"
          >refresh</v-icon>
        </div>
      </div>
      <v-flex xs12 style="margin-top:30px">
        <v-card style="border-radius:2px" text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                  <b-field>
                    <b-input
                      placeholder="Search..."
                      type="search"
                      icon="magnify"
                      v-model="tempSearch"
                      @keyup.native="setTime()"
                      @keydown.native="clearTime()"
                    ></b-input>
                  </b-field>
              </v-flex>
              <v-flex xs12 sm6 style="display:flex; justify-content: right">
                <b-button type="is-info" @click="dialog = true;openCamera()">Verifikasi Mahasiswa</b-button>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <div style="margin-top:20px">
        <b-table
          :data="usersList"
          :paginated="true"
          :per-page="perPage"
          :current-page.sync="currentPage"
          :loading="loadData"
          :pagination-simple="true"
          :narrowed="true"
          :mobile-cards="true"
          :striped="true"
          :hoverable="true"
          :default-sort-direction="defaultSortDirection"
          default-sort="created_at"
        >
          <template slot-scope="props">
            <b-table-column label="No" sortable>{{ props.index + 1 }}</b-table-column>
            <b-table-column label="Foto" sortable>
              <v-img :src="$apiUrl+'/model/realpict/'+props.row.npm+'.jpg'" style="width: 100px; height: auto"></v-img>
            </b-table-column>
            <b-table-column field="name" label="Nama" sortable>{{ props.row.name }}</b-table-column>
            <b-table-column field="npm" label="NPM" sortable>{{ props.row.npm }}</b-table-column>
            <b-table-column field="created_at" label="Mendaftar Pada" sortable>{{ props.row.created_at }}</b-table-column>
            <b-table-column label>
              <v-menu transition="slide-x-transition" offset-x left>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click.prevent="editDialog = true; setEditData(props.row)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click.prevent="deleteDialog = true; deleteId = props.row.id">
                    <v-list-item-title>Hapus</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </b-table-column>
          </template>
          <template slot="empty">
            <section class="section">
              <div class="content has-text-grey has-text-centered">
                <p>
                  <b-icon icon="emoticon-sad" size="is-large"></b-icon>
                </p>
                <p>Nothing here.</p>
              </div>
            </section>
          </template>
        </b-table>
      </div>
    </div>
    <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Verifikasi Mahasiswa</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="cameraForm"  style="min-height: 380px" >
              <div :style="!uploading ? 'display: none' : ''">
                <img :src="img" alt="">
              </div>
              <web-cam 
              ref="webcam"
              :device-id="deviceId"
              width="100%"
              @cameras="onCameras"
              @camera-change="onCameraChange" :style="uploading ? 'display: none' : ''"></web-cam>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <b-button type="is-danger" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="dialog = false; closeCamera()">Batal</b-button>
          <b-button type="is-success" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="sendData();">
            <img :src="require('@/assets/loading/bars.svg')" alt="" style="width: 20px;" v-if="uploading">
            <span v-else>Verifikasi</span>
          </b-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <v-snackbar v-model="snackbar.disp" :color="snackbar.color" :multi-line="true" :timeout="3000">
      {{ snackbar.text }}
      <v-btn dark text @click="snackbar.disp = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { WebCam } from "vue-web-cam";

const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
};
export default {
  components: {
    WebCam
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      data: new FormData(),
      percentCompleted: 0,
      uploading: false,
      isActiveCamera: true,
      dialog: false,
      selectedFilter: -1,
      snackbar: {
        color: "#d32f2f",
        text: "msg",
        disp: false
      },
      users: [],
      refresh: false,
      typingTimer: null,
      tempSearch: "",
      search: "",
      loadData: true,
      defaultSortDirection: "desc",
      currentPage: 1,
      perPage: 10,
      isPaginated: true,
      isPaginationSimple: true,
      img: null,
      camera: null,
      deviceId: null,
      devices: []
    };
  },
  watch:{
    $route(to,from){
      if(to.params.view != from.params.view){
        this.getData()
      }
    },
    camera: function(id) {
        this.deviceId = id;
    },
    devices: function() {
      // Once we have a list select the first one
      const [first, ...tail] = this.devices; // eslint-disable-line no-unused-vars
      if (first) {
          this.camera = first.deviceId;
          this.deviceId = first.deviceId;
      }
    }
  },
  computed: {
    device: function() {
        return this.devices.find(n => n.deviceId === this.deviceId);
    },
    usersList() {
      return this.users.filter(row => {
        if (this.search != "")
          return row.name.toLowerCase().includes(this.search.toLowerCase());
        return true;
      });
    }
  },
  methods: {
    preparedata(){
      this.data = new FormData()
      this.img = this.$refs.webcam.capture()
      this.data.append('picture',this.img)
    },
    sendData(){
      this.preparedata()
      this.percentCompleted =0;
      this.uploading = true;
      var configData = {
          headers: { 'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token') } ,
          onUploadProgress: function(progressEvent) {
              this.percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
              this.$forceUpdate();
          }.bind(this)
      };
      var uri = this.$modelUrl + '/verify'
      var vm = this
      this.$http.post(uri, this.data, configData)
      .then(function (response) {
        vm.snackbar.disp = true;
        vm.snackbar.text = response.data.msg + '('+response.data.score+')'
        vm.snackbar.color = '#32bdca';
        vm.uploading = false
      }.bind(this))
      .catch(function (error) {
        vm.percentCompleted = 0
        vm.snackbar.disp = !!error;
        vm.snackbar.text = 'Coba lagi'
        vm.snackbar.color = '#d32f2f';
        vm.uploading = false
      });
    },
    onCapture() {
        this.img = this.$refs.webcam.capture();
    },
    onCameras(cameras) {
        this.devices = cameras;
    },
    onCameraChange(deviceId) {
        this.deviceId = deviceId;
        this.camera = deviceId;
    },
    closeCamera(){
        if(this.isActiveCamera){
          this.$refs.webcam.stop();
          this.isActiveCamera = false
        }
    },
    openCamera(){
      if(!this.isActiveCamera){
        this.$refs.webcam.start();
        this.isActiveCamera = true
      }
    },
    setTime() {
      this.loadData = true;
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(this.setSearch, 2000);
    },
    clearTime() {
      clearTimeout(this.typingTimer);
    },
    setSearch() {
      this.loadData = false;
      this.search = this.tempSearch;
    },
    getData() {
      this.loadData = true;
      var uri
      uri = this.$apiUrl + "/api/attendance";
      this.$http.get(uri, config).then(response => {
        this.users = response.data;
        this.loadData = false;
      });
    }
  }
};
</script>

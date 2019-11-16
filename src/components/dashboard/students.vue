<template id="admin-list">
  <div class="contentlist">
    <div class="flex-container">
      <div class="columns m-t-10">
        <div class="column" style="display:flex">
          <h1 class="title" style="margin-bottom: 0; margin-right: 10px;">Mahasiswa</h1>
          <v-icon
            @click="getData(); refresh =true"
            :style="refresh ?'transform:rotate(360deg)':'transform: none'"
          >refresh</v-icon>
        </div>
      </div>
      <v-layout row wrap>
        <v-flex xs12 style="display:flex">
          <v-icon color="#C4C4C4">fiber_manual_record</v-icon>
          <span style="align-self: center;">Total Mahasiswa : {{users.length}}</span>
        </v-flex>
      </v-layout>
      <v-flex xs12 style="margin-top:30px">
        <v-card style="border-radius:2px" text>
          <v-container grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm3>
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
              <v-flex xs12 sm9 style="justify-content:right;display: flex;">
                <b-button type="is-info" @click="dialog = true;">Tambah Mahasiswa</b-button>
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
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Data Mahasiswa</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="contentForm">
              <div class="bodyForm">
                  <div class="fieldControll">
                      <div class="labelField">
                          <span>Nama</span>
                      </div>
                      <div class="inputField">
                          <input type="text" v-model="name">
                      </div>
                      <span class="fieldInfo" :class="nameStat? '': 'showFieldInfo'">Nama tidak valid</span>
                  </div>
              </div>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <b-button type="is-danger" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="editDialog = false;">Batal</b-button>
          <b-button type="is-success" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="updateData();">
            <img :src="require('@/assets/loading/bars.svg')" alt="" style="width: 20px;" v-if="uploading">
            <span v-else>Perbaharui</span>
          </b-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Data Mahasiswa</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <div class="contentForm" v-if="detailData == 0">
              <div class="bodyForm">
                  <div class="fieldControll">
                      <div class="labelField">
                          <span>Nama</span>
                      </div>
                      <div class="inputField">
                          <input type="text" v-model="name">
                      </div>
                      <span class="fieldInfo" :class="nameStat? '': 'showFieldInfo'">Nama tidak valid</span>
                  </div>
                  <div class="fieldControll">
                      <div class="labelField">
                          <span>NPM</span>
                      </div>
                      <div class="inputField">
                          <input type="text" v-model="npm">
                      </div>
                      <span class="fieldInfo" :class="npmStat? '': 'showFieldInfo'">NPM tidak valid</span>
                  </div>
              </div>
            </div>
            <div class="cameraForm" v-if="detailData == 1 || cameraStat" style="min-height: 380px" :style="!cameradisp ? 'display: none' : ''">
              <div :style="!uploading ? 'display: none' : ''">
                <img :src="img" alt="">
              </div>
              <web-cam 
              ref="webcam"
              :device-id="deviceId"
              width="100%"
              @cameras="onCameras"
              @camera-change="onCameraChange" :style="uploading ? 'display: none' : ''"></web-cam>
              <div class="deviceoption">
                <select v-model="camera">
                            <option>-- Select Device --</option>
                            <option
                                v-for="device in devices"
                                :key="device.deviceId"
                                :value="device.deviceId"
                            >{{ device.label }}</option>
                        </select>
              </div>
              <!-- <div class="test"> -->
                 <!-- <button type="button" class="btn btn-primary" @click="onCapture">Capture Photo</button> -->
                        <!-- <button type="button" class="btn btn-danger" @click="onStop">Stop Camera</button> -->
                        <!-- <button type="button" class="btn btn-success" @click="onStart">Start Camera</button> -->
              <!-- </div> -->
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
      
          <b-button type="is-danger" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="dialog = false; closeCamera()" v-if="detailData == 0">Batal</b-button>
          <b-button type="is-danger" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="detailData = 0; cameradisp = false" v-if="detailData == 1">Kembali</b-button>
          <b-button type="is-warning" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="setDetail(); cameradisp = true" v-if="detailData == 0">Lanjut</b-button>
          <b-button type="is-success" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="sendData();" v-if="detailData == 1">
            <img :src="require('@/assets/loading/bars.svg')" alt="" style="width: 20px;" v-if="uploading">
            <span v-else>Daftarkan</span>
          </b-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    <v-row justify="center">
    <v-dialog
      v-model="deleteDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Hapus data mahasiswa ini ?</v-card-title>
        <v-card-text>
          Data mahasiswa akan dihapus beserta dengan foto yang sudah pernah diambil.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <b-button type="is-warning" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="deleteDialog = false; deleteId = -1">Batal</b-button>
          <b-button type="is-danger" style="margin-left: 10px; width: 100%; max-width: 120px;" @click="deleteData()"><img :src="require('@/assets/loading/bars.svg')" alt="" style="width: 20px;" v-if="uploading">
            <span v-else>Hapus</span>
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
<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;

  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}

.primary {
  background: orange;
}
.pengaturan {
  display: none !important;
}
.showPengaturan {
  display: flex !important;
  background: #e1e3e7;
  max-width: 100%;
  margin: 0px 10px;
  padding-top: 20px;
  border-bottom-right-radius: 7px;
  border-bottom-left-radius: 7px;
}
.checkinArea {
  display: none !important;
}
.showcheckinArea {
  display: flex !important;
}
.numberinput {
  cursor: default;
  width: 35px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}
</style>

<script>
import { WebCam } from "vue-web-cam";
const config = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token")
  }
}
export default {
  components: {
    WebCam
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      deleteDialog: false,
      deleteId: -1,
      editDialog: false,
      npm: '160708967',
      uploading: false,
      percentCompleted: 0,
      isActiveCamera: true,
      cameradisp: false,
      cameraStat: false,
      detailData: 0,
      data: new FormData(),
      name: null,
      nameStat: true,
      npmStat: true,
      dialog: false,
      snackbar:{
        color: '#d32f2f',
        text: 'msg',
        disp: false
      },
      editData: {},
      users: [],
      refresh: false,
      typingTimer: null,
      tempSearch: "",
      wajib: true,
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
  watch: {
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
    usersList () {
      return this.users.filter(row => {
          if(this.search != '') return row.name.toLowerCase().includes(this.search.toLowerCase())
          return true
      })
    }
  },
  methods: {
    deleteData(){
      var uri = this.$apiUrl + '/api/student/'+ this.deleteId
      this.uploading = true;
      var vm = this
      this.$http.delete(uri, config)
      .then(function (response) {
        vm.snackbar.disp = true;
        vm.snackbar.text = response.data.msg
        vm.snackbar.color = '#32bdca';
        vm.uploading = false
        vm.deleteDialog = false
        vm.reset()
      }).catch(function (error) {
        vm.snackbar.disp = !!error;
        vm.snackbar.text = 'Coba lagi'
        vm.snackbar.color = '#d32f2f';
        vm.uploading = false
      });
    },
    setEditData(userData){
      this.editData.id = userData.id
      this.name = userData.name
      this.npm = userData.npm
    },
    updateData (){
      if(!this.validation()){
        return
      }
      var uri = this.$apiUrl + '/api/student/'+ this.editData.id
      this.uploading = true;
      this.editData.name = this.name
      this.editData.npm = this.npm
      var vm = this
      this.$http.post(uri, this.editData, config)
      .then(function (response) {
        vm.snackbar.disp = true;
        vm.snackbar.text = response.data.msg
        vm.snackbar.color = '#32bdca';
        vm.uploading = false
        vm.editDialog = false
        vm.reset()
      }).catch(function (error) {
        vm.snackbar.disp = !!error;
        vm.snackbar.text = 'Coba lagi'
        vm.snackbar.color = '#d32f2f';
        vm.uploading = false
      });
    },
    reset(){
      this.detailData = 0
      this.cameradisp = false
      this.dialog = false;
      this.closeCamera()
      this.data = new FormData()
      this.name = null
      this.npm = '160708967'
      this.getData()
    },
    preparedata(){
      this.data = new FormData()
      this.data.append('name',this.name)
      this.data.append('npm',this.npm)
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
      var uri = this.$modelUrl + '/students'
      var vm = this
      this.$http.post(uri, this.data, configData)
      .then(function (response) {
        vm.snackbar.disp = true;
        vm.snackbar.text = response.data.msg
        vm.snackbar.color = '#32bdca';
        vm.uploading = false
        vm.reset()
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
        this.isActiveCamera = false
        try{
          this.$refs.webcam.stop();
        }catch(e){
          this.isActiveCamera = false
        }
    },
    validation(){
      this.nameStat = true
      this.npmStat = true
      if(this.name == null || this.name == '' || !(/^[a-zA-Z][a-zA-Z\. ]*$/.test(this.name))){ // eslint-disable-line no-useless-escape
        this.nameStat = false
        return false
      }
      if(this.npm == null || this.npm == '' || (/^[a-zA-Z][a-zA-Z\. ]*$/.test(this.npm))){ // eslint-disable-line no-useless-escape
        this.npmStat = false
        return false
      }
    
      return true
    },
    setDetail(){
      if(!this.validation()){
        return
      }
      this.detailData = 1
      this.cameraStat = true
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
      this.loadData = true
      var uri = this.$apiUrl + "/api/students"
      this.$http.get(uri, config).then(response => {
        this.users = response.data
        this.loadData = false
      });
    }
  }
};
</script>

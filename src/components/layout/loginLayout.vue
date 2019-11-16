<template>
    <div>
        <div class="columns">
            <div class="column nomargin is-two-fifths p-30">
                <div class="logoAtma">
                    <div class="pictureLogo">
                        <img :src="require('@/assets/logoatma.png')" alt="">
                    </div>
                    <div class="sistemName">
                        <strong>Sistem</strong> <br>
                        <strong>Pengenalan</strong> <br>
                        <strong>Wajah</strong>
                    </div>
                </div>
                <div class="loginForm">
                    <div class="headerForm">
                        <strong>Selamat Datang</strong><br>
                        <span>Silahkan masuk untuk melanjutkan</span>
                    </div>
                    <div class="errorMsg" :class="loginError ? 'showErrorMsg' : ''">
                        {{message}}
                    </div>
                    <div class="contentForm">
                        <div class="bodyForm">
                            <div class="fieldControll">
                                <div class="labelField">
                                    <span>Email</span>
                                </div>
                                <div class="inputField">
                                    <input type="email" v-model="email" @keyup="setTime()" @keydown="clearTime()">
                                </div>
                                <span class="fieldInfo" :class="emailStat? '': 'showFieldInfo'">Email tidak valid</span>
                            </div>
                            <div class="fieldControll">
                                <div class="labelField">
                                    <span>Password</span>
                                </div>
                                <div class="inputField withIcon">
                                    <input :type="show ? 'text' : 'password'" v-model="password" @keyup.enter="submitLogin()">
                                    <v-icon @click="show = !show">{{show ? 'visibility' : 'visibility_off'}}</v-icon>
                                </div>
                                <span class="fieldInfo" :class="passwordStat? '': 'showFieldInfo'">Password tidak boleh kosong</span>
                            </div>
                        </div>
                        <div class="footerForm m-t-40">
                            <button @click.prevent="submitLogin()">
                                <img :src="require('@/assets/loading/bars.svg')" alt="" style="width: 20px;" v-if="load">
                                <span v-if="!load">Masuk</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column nomargin nopadding loginBg">
                
            </div>
        </div>
    </div>
</template>
<script>
import store from '../../store/index'

export default {
    data() {
        return {
            passwordStat: true,
            emailStat: true,
            emailRegex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line no-useless-escape
            typingTimer: null,
            show: false,
            error : false,
            showpassword:false,
            message: '',
            email: '',
            password: '',
            loginError: false,
            load: false,
            valid: true,
                emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid'
            ],
            rules: {
                required: value => !!value || 'Required.',
                emailMatch: () => ('The email and password you entered don\'t match')
            }
        }
    },
    methods: {
        setTime(){
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(this.cekEmail(), 1000);
        },
        clearTime(){
            clearTimeout(this.typingTimer);
        },
        cekEmail(){
            this.emailStat = this.emailRegex.test(this.email) 
        },
        validate(){
            this.cekEmail()
            var valid = true
            if(!this.emailStat){
                valid = false
            }
            if(this.password == null || this.password == ''){
                this.passwordStat = false
                valid = false
            }else{
                this.passwordStat = true
            }
            return valid
        },
        submitLogin() {
            this.loginError = false;
            if(!this.validate()){
                return
            }
            this.load = true
            this.$http.post(this.$apiUrl + '/api/auth/login', {
                email: this.email,
                password: this.password
            }).then(response => {
                store.commit('loginUser')
                localStorage.setItem('token', response.data.access_token)
                this.$router.push({ name: 'DashboardContent' })
            }).catch(error => {
                this.load = !error
                this.loginError = true
                this.message = 'Email atau password anda salah'
            });
        }
    }
}
</script>
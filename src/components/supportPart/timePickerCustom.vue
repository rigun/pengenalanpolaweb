<template>
  <div class="timePicker">
    <v-icon class="timeIcon">access_time</v-icon>
    <input
      type="text"
      class="timeDisplay"
      placeholder="23:59"
      readonly
      v-model="value"
      @click="pickStat = true; setTime()"
    />
    <div class="time" v-if="pickStat">
      <div style="display:flex">
        <div class="centerBox hourBox">
          <v-icon @click="configHour(1)">expand_less</v-icon>
          <input  type="text" class="digitBox hour" :value="dHour" @input="hourInput($event)"/>
          <v-icon @click="configHour(-1)">expand_more</v-icon>
        </div>
        <div class="timeSeparator" style="align-self: center;">:</div>
        <div class="centerBox minuteBox">
          <v-icon @click="configTime(1)">expand_less</v-icon>
          <input  type="text" class="digitBox minute" :value="dTime" @input="timeInput($event)"/>
          <v-icon @click="configTime(-1)">expand_more</v-icon>
        </div>
      </div>
      <div style="width:100%">
        <button class="setButton" @click="setTimeValue()">Set</button>
      </div>
    </div>
  </div>
</template>
<style>
.setButton {
  width: 100%;
  background: #9292fe;
  color: white;
  padding: 3px;
}
.centerBox {
  text-align: center;
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 50%;
}
.time {
  width: 100%;
  max-width: 135px;
}
.timeIcon {
  border: solid 1px #ddd;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  padding: 3px;
  background: #f5f5f5;
}
.timeDisplay {
  font-size: 16px;
  width: 96px;
  height: 40px;
  border: solid 1px #ddd;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  padding: 5px;
  text-align: center;
}
.digitBox {
  margin: auto;
  background: white;
  border: solid 1px #ddd;
  width: 40px;
  font-size: 16px;
  padding: 2px;
  text-align: center;
}
.box {
  text-align: center;
}
.time {
  background: white;
  z-index: 99;
  position: absolute;
  left: 0;
  top: 42px;
  -webkit-box-shadow: 1px 2px 15px 0px rgba(179, 173, 179, 1);
  -moz-box-shadow: 1px 2px 15px 0px rgba(179, 173, 179, 1);
  box-shadow: 1px 2px 15px 0px rgba(179, 173, 179, 1);
  border: solid 1px #ddd;
  border-radius: 4px;
}
.timePicker {
  display: flex;
  position: relative;
}
</style>
<script>
export default {
  props: {
    value: {
      type: String,
      default: "23:59"
    },
    status:{
      type: Boolean,
      default: false
    },
    bTime:{
      type: String,
      default: null
    }
  },
  data: () => ({
    pickStat: false,
    hour: 0,
    time: 0,
    dHour: "00",
    dTime: "00"
  }),
  watch:{
    status(old){
      this.pickStat = old
    }
  },
  methods: {
    validate(){
        if(this.bTime != null){
          var lTime = parseInt(this.dTime)
          var lHour = parseInt(this.dHour)
          var bTime = parseInt(this.bTime.slice(3, 5))
          var bHour = parseInt(this.bTime.slice(0, 2))
          if(lHour > bHour){
            this.hour = lHour
            this.time = lTime
          }else{
            this.hour = bHour
            if(lTime > bTime){
              this.time = lTime
            }else{
              this.time = bTime
            }
          }
          this.configTime(0)
          this.configHour(0)
        }
    },
    setTime() {
      try {
        this.dTime = this.value.slice(3, 5);
        this.dHour = this.value.slice(0, 2);
        this.validate()
      } catch (e) {
        console.log(e) //eslint-disable-line no-console
      }
    },
    hourInput(e) {
      if (e.target.value) {
        this.hour = e.target.value;
      } else {
        this.hour = 0;
      }
      this.configHour(0);
    },
    timeInput(e) {
      if (e.target.value) {
        this.time = e.target.value;
      } else {
        this.time = 0;
      }
      this.configTime(0);
    },
    configHour(n) {
      this.hour = parseInt(this.hour) + parseInt(n);
      if (this.hour >= 24) {
        this.hour = 0;
      } else if (this.hour < 0) {
        this.hour = 23;
      }
      if (this.hour < 10) {
        this.dHour = "0" + this.hour;
      } else {
        this.dHour = this.hour;
      }
    },
    configTime(n) {
      this.time = parseInt(this.time) + parseInt(n);
      if (this.time >= 60) {
        this.time = 0;
      } else if (this.time < 0) {
        this.time = 59;
      }
      if (this.time < 10) {
        this.dTime = "0" + this.time;
      } else {
        this.dTime = this.time;
      }
    },
    setTimeValue() {
      this.validate()
      this.pickStat = false;
      this.$emit("input", this.dHour + ":" + this.dTime);
      this.$emit("setLimitTime", this.dHour + ":" + this.dTime);
    }
  }
};
</script>

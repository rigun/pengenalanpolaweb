<template>
<div></div>
</template>
<script>
import store from '../store/index.js'
export default {
  mounted () {
    localStorage.removeItem('token')
    store.commit('logoutUser')
    this.$router.push({ name: 'Login' })
  }
}
</script>
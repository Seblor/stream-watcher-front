<template>
  <div class="navbar">
    <div>
      <img class="navbar-logo" src="../assets/logo.png" alt="Logo stream Watcher" />
      <h1>Stream Watcher</h1>
    </div>
    <div>
      <language-selector />
      <logout-btn v-if="userData" :imageUrl="userData.avatarURL" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LanguageSelector from './LanguageSelector.vue'
import LogoutBtn from './LogoutBtn.vue'

export default {
  components: {
    LogoutBtn,
    LanguageSelector
  },
  data () {
    return {
      val: ''
    }
  },
  computed: {
    ...mapState(['userData'])
  }
}
</script>

<style>
.navbar {
  padding-left: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: rgb(32, 34, 37);
}

.navbar > div {
  padding: 5px 10px;
  height: 75%;
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 100%;
  margin-right: 15px;
}
</style>

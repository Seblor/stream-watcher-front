<template>
  <div id="app">
    <navbar />
    <div id="content">
      <div v-if="isLoggedIn" id="panel">
        <guilds-list />
        <guild-config v-if="selectedGuildId" />
        <div v-else class="no-selection">
          <h1>{{$t("PANEL.SELECT-SERVER")}}</h1>
        </div>
      </div>
      <login-panel v-else />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import GuildsList from './components/GuildsList.vue'
import GuildConfig from './components/GuildConfig.vue'
import LoginPanel from './components/LoginPanel.vue'
import Navbar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    GuildsList,
    GuildConfig,
    LoginPanel,
    Navbar
  },
  created () {
    this.init()
  },
  computed: {
    ...mapState(['guilds', 'selectedGuildId']),
    isLoggedIn () {
      return this.guilds !== null
    }
  },
  methods: {
    ...mapActions(['init'])
  }
}
</script>

<style>
body {
  margin: 0px;
  background-color: rgba(0, 0, 0, .8);
  font-family: system-ui;
}

#app {
  color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
}

#content {
  display: flex;
  flex-grow: 1;
  min-height: 0px;
}

#panel {
  text-align: center;
  display: flex;
  flex-grow: 1;
  min-width: 0;
}

input {
  background-color: hsl(216, 7%, 25%);
  border-radius: 15px;
  border: none;
  font-size: 1em;
  padding: 5px;
  outline: none;
  color: #aaaaff;
}

.no-selection {
  flex-grow: 1;
}

.btn {
  cursor: pointer;
  border-radius: 15px;
  margin: 0 5px;
}

.btn:disabled {
  cursor: not-allowed;
  box-shadow: inset 0 0 100px 100px rgba(50, 50, 50, .7);
  transition: background-color .25s, border-color .25s, color .25s;
}

.btn.btn-primary {
  background-color: #4444aa;
  border: 2px solid#4444aa;
  color: #ffffff;
}

.btn.btn-primary:hover {
  background-color: hsl(240, 43%, 35%);
  transition: background-color .25s;
}

.btn.btn-primary:disabled {
  border-color: hsl(240, 30%, 30%);
  color: grey;
}

.btn.btn-danger {
  background-color: #66666666;
  border: 2px solid#ff3333;
  color: #ff3333;
  transition: background-color .25s, color .25s;
}

.btn.btn-danger:hover:not(:disabled) {
  background-color: #ff3333;
  border: 2px solid#ff3333;
  color: #ffffff;
  transition: background-color .25s, color .25s;
}

.btn.btn-danger:disabled {
  background-color: #66666666;
  border: 2px solid hsl(0, 50%, 50%);
  color: hsl(0, 50%, 50%);
  transition: background-color .25s;
}
</style>

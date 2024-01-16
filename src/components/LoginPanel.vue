<template>
  <div class="login">
    <div class="description">
      <h1>Stream Watcher</h1>
      <h4>
        {{$t("START.DESCRIPTION")}}
      </h4>
      <p>{{$t("START.SUB-DESCRIPTION")}}</p>
    </div>
    <div class="button-div">
      <a href="#" @click="discordLogin">
        <button>{{$t("BUTTONS.LOGIN")}}</button>
      </a>
    </div>
    <div><img :src="eventExample" alt=""></div>
    <support-server-link />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SupportServerLink from './SupportServerLink.vue'

export default {
  data () {
    return {
      eventExample: require('../assets/event_example.png')
    }
  },
  components: {
    SupportServerLink
  },
  computed: {
    ...mapState(['appId']),
    getOAuthLink () {
      const baseLink = `https://discord.com/api/oauth2/authorize?client_id=${this.appId}&redirect_uri=${encodeURI(
        window.location.origin + '/'
      )}&response_type=code&scope=identify%20guilds`
      let randomString = ''
      const randomNumber = Math.floor(Math.random() * 10)

      for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(
          33 + Math.floor(Math.random() * 94)
        )
      }

      localStorage.setItem('oauth-state', randomString)
      return `${baseLink}&state=${window.btoa(randomString)}`
    }
  },
  methods: {
    discordLogin () {
      window.location.href = this.getOAuthLink
    }
  }
}
</script>

<style>
.login {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.login .button-div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login .button-div button {
  cursor: pointer;
  background-color: #6666ff;
  border-radius: 25px;
  border: 2px solid black;
  font-size: 2em;
  padding: 15px;
  font-weight: bold;
}

.login .button-div button:not(:active) {
  box-shadow: 5px 5px 5px 2px;
}
</style>

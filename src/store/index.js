import Vue from 'vue'
import Vuex from 'vuex'
import lang from '../lang'
// import createPersistedState from 'vuex-persistedstate'

const streamerStatusCache = {}

Vue.use(Vuex)
/**
 * @type {WebSocket}
 */
let socket = null

function getdefaultState () {
  return {
    userData: null,
    guilds: null,
    selectedGuildId: null
  }
}

export default new Vuex.Store({
  // plugins: [createPersistedState({ key: 'stream-watcher' })],
  state: {
    appId: null,
    ...getdefaultState()
  },
  getters: {
    getGuildWatchers: (state) => (guildId) => {
      return state.guilds.find(guild => guild.id === guildId).watchers
    }
  },
  mutations: {
    updateUserData (state, userData) {
      Vue.set(state, 'userData', userData)
    },
    updateAppId (state, appId) {
      Vue.set(state, 'appId', appId)
    },
    updateGuildList (state, guilds) {
      Vue.set(state, 'guilds', guilds)
    },
    selectGuild (state, selectedGuildId) {
      Vue.set(state, 'selectedGuildId', selectedGuildId)
    },
    clearStore (state) {
      Object.assign(state, getdefaultState())
    }
  },
  actions: {
    async init ({ state, commit, dispatch }) {
      const guildIdFromURL = location.pathname.replace(/\D/g, '')
      if (guildIdFromURL) {
        await dispatch('selectGuild', guildIdFromURL)
      }
      lang.locale = localStorage.getItem('selected-lang') || 'en'
      const url = new URL(location.href)
      const codeParam = url.searchParams.get('code')
      const stateParam = url.searchParams.get('state')
      if (codeParam && stateParam && localStorage.getItem('oauth-state') === window.atob(decodeURIComponent(stateParam))) {
        window.history.replaceState(null, null, window.location.pathname)
        localStorage.removeItem('oauth-state')
      }

      connect((socket) => {
        // Listen for messages
        socket.addEventListener('message', function (event) {
          const data = JSON.parse(event.data)
          switch (data.type) {
            case 'guildsList':
              commit('updateGuildList', data.guildsList)
              if (!data.guildsList.find(guild => guild.id === state.selectedGuildId)) {
                commit('selectGuild', null)
              }
              break
            case 'userData':
              if (data.appId) {
                commit('updateAppId', data.appId)
              }
              if (data.userData) {
                commit('updateUserData', data.userData)
              } else {
                return dispatch('logout')
              }
              break
          }
        })

        if (socket.readyState === socket.OPEN) {
          query({ type: 'initSession', payload: { code: codeParam } })
        } else {
          // Connection opened
          socket.addEventListener('open', () => {
            query({ type: 'initSession', payload: { code: codeParam } })
          })
        }
      })
    },
    selectGuild ({ commit }, selectedGuildId) {
      window.history.pushState({}, document.title, selectedGuildId ? `/${selectedGuildId}` : '/')
      commit('selectGuild', selectedGuildId)
    },
    logout ({ commit }) {
      commit('clearStore')
      return query({ type: 'logout' })
    },
    removeFromGuild (_, guildId) {
      return query({ type: 'leaveGuild', payload: { guildId } })
    },
    async getStreamerStatus (_, streamer) {
      if (streamerStatusCache[streamer] === undefined) {
        streamerStatusCache[streamer] = query({ type: 'streamerStatus', payload: { streamer } })// Storing the promise to avoid race conditions
      }
      return await streamerStatusCache[streamer]
    },
    saveWatcher (_, { id, guildId, streamerName, titleFilter }) {
      return query({
        type: 'saveWatcher',
        payload: {
          id,
          guildId,
          streamerName,
          titleFilter
        }
      })
    },
    removeWatcher (_, { id }) {
      return query({
        type: 'removeWatcher',
        payload: {
          id
        }
      })
    }
  }
})

function query (data) {
  const reqId = Math.floor(Math.random() * 1e6)
  data.reqId = reqId
  return new Promise(resolve => {
    const receive = (event) => {
      const response = JSON.parse(event.data)
      if (response.reqId === reqId) {
        socket.removeEventListener('message', receive)
        resolve(response.streamerStatus)
      }
    }
    socket.addEventListener('message', receive)
    socket.send(JSON.stringify(data))
  })
}

function connect (callback) {
  if (window.location.protocol === 'https:') {
    socket = new WebSocket(`wss://${window.location.host}`)
  } else {
    socket = new WebSocket(`ws://${window.location.host}`)
  }

  socket.onopen = () => callback(socket)

  socket.onclose = function (e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
    setTimeout(function () {
      connect(callback)
    }, 1000)
  }

  socket.onerror = function (err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket')
    socket.close()
  }
}

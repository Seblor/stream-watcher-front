<template>
  <div class="guild-config">
    <h1>{{ guild.name }}</h1>
    <div class="watchers-list">
      <watcher
        v-for="watcher in watchers"
        :key="watcher.id"
        :streamerName="watcher.streamer"
        :titleFilter="watcher.titleIncludes"
        @saving="(...args) => editingWatcher(...args, watcher.id)"
        @removing="() => removingWatcher(watcher.id, false)"
      />
      <watcher
        v-for="newWatcherId in newWatchers"
        :key="newWatcherId"
        @saving="
          (name, filter) => {
            savingWatcher(name, filter, newWatcherId);
          }
        "
        @removing="() => removingWatcher(newWatcherId, true)"
      />
      <div class="watcher new-watcher" v-if="watchers.length + newWatchers.length < 100">
        <img src="../assets/add.svg" alt="" @click="createWatcher" />
      </div>
    </div>
    <button class="remove-bot-btn" @click="removeBot">
      {{$t('PANEL.REMOVE-BOT')}}
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Watcher from './Watcher.vue'
export default {
  components: { Watcher },
  data () {
    return {
      /**
       * @type {number[]}
       */
      newWatchers: []
    }
  },
  computed: {
    ...mapState(['guilds', 'selectedGuildId']),
    guild () {
      return this.guilds.find((guild) => guild.id === this.selectedGuildId)
    },
    watchers () {
      return this.guild.watchers
    }
  },
  methods: {
    ...mapActions(['removeFromGuild', 'saveWatcher', 'removeWatcher']),
    applyConfig () {},
    removeBot () {
      if (
        confirm(
          this.$t('PANEL.REMOVE-BOT-CONFIRM', [this.guild.name])
        )
      ) {
        this.removeFromGuild(this.selectedGuildId)
      }
    },
    createWatcher () {
      this.newWatchers.push(Date.now())
    },
    async savingWatcher (streamerName, titleFilter, tempId) {
      await this.saveWatcher({
        id: null,
        guildId: this.selectedGuildId,
        streamerName,
        titleFilter
      })
      this.removingWatcher(tempId, true)
    },
    editingWatcher (streamerName, titleFilter, id = null) {
      this.saveWatcher({
        id,
        guildId: this.selectedGuildId,
        streamerName,
        titleFilter
      })
    },
    removingWatcher (watcherId, isNewWatcher) {
      if (isNewWatcher) {
        this.newWatchers.splice(
          this.newWatchers.findIndex((tempId) => tempId === watcherId),
          1
        )
      } else {
        this.removeWatcher({ id: watcherId })
      }
    }
  }
}
</script>

<style>
.guild-config {
  display: flex;
  flex-grow: 1;
  flex-shrink: 2;
  overflow-wrap: break-word;
  word-break: break-all;
  overflow-x: auto;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
}

.watchers-list {
  overflow-y: auto;
  width: 100%;
}

.watchers-list .new-watcher {
  justify-content: center;
}

.watchers-list .new-watcher img {
  cursor: pointer;
  max-height: 28px;
}

.guild-config .remove-bot-btn {
  width: 250px;
  cursor: pointer;
  background-color: #66666666;
  border-radius: 25px;
  border: 2px solid#ff3333;
  color: #ff3333;
  padding: 15px;
  margin: 25px;
  font-weight: bold;
  transition: background-color 0.25s, border 0.25s, color 0.25s;
}

.guild-config .remove-bot-btn:hover {
  background-color: #ff3333;
  border: 2px solid#ff3333;
  color: #ffffff;
  transition: background-color 0.25s, border 0.25s, color 0.25s;
}
</style>

<template>
  <div
    class="guild-item"
    @click="guildClick"
    :class="{ selected: isSelected }"
  >
    <img :src="guildData.imageUrl" alt="" />
    <p>
      {{ guildData.name }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    guildId: {
      type: String,
      required: false
    }
  },
  computed: {
    ...mapState(['guilds', 'selectedGuildId', 'appId']),
    /**
     * @returns {{
     *  name: string
     *  imageUrl: string,
     *  config: object
     * }}
     */
    guildData () {
      return (
        this.guilds.find((guild) => guild.id === this.guildId) ?? {
          name: this.$t('PANEL.ADD-SERVER'),
          id: null,
          imageUrl: require('../assets/add.svg'),
          config: {}
        }
      )
    },
    isSelected () {
      return this.guildId === this.selectedGuildId
    }
  },
  methods: {
    ...mapActions(['selectGuild']),
    guildClick () {
      if (this.guildId) {
        this.selectGuild(this.guildId)
      } else {
        window.open(
          `https://discord.com/api/oauth2/authorize?client_id=${this.appId}&permissions=8589934592&scope=bot`,
          'Login',
          'menubar=no,width=500,height=777,location=no,resizable=no,scrollbars=yes,status=no'
        )
      }
    }
  }
}
</script>

<style>
.guild-item {
  color: #aaaaff;
  font-size: 1.25em;
  display: flex;
  cursor: pointer;
  align-items: center;
}

.guild-item:hover {
  box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.1);
}

.guild-item.selected {
  box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.2);
}

.guild-item > * {
  padding: 5px;
}

.guild-item > p {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.guild-item > img {
  width: 60px;
  height: 60px;
}
</style>

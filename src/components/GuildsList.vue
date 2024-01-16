<template>
  <div class="guilds-list">
    <h2>{{ $t('PANEL.SERVERS-LIST') }}</h2>
    <div class="guilds">
      <guild-item />
      <guild-item v-for="guild in guilds" :key="guild.id" :guildId="guild.id" />
    </div>
    <support-server-link />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GuildItem from './GuildItem.vue'
import SupportServerLink from './SupportServerLink.vue'

export default {
  components: {
    GuildItem,
    SupportServerLink
  },
  computed: {
    ...mapState(['guilds'])
  }
}
</script>

<style >
.guilds-list {
  color: white;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: auto;
  background-color: hsl(216, 7%, 17%);
  width: 250px;
}

.guilds-list h1 {
  text-align: center;
}

.guilds-list .guilds {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0px;
}
</style>

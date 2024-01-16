<template>
  <div class="watcher">
    <div>
      <p>https://twitch.tv/</p>
      <div class="streamer-input">
        <input
          :class="{ invalid: streamer === null && streamerNameEdit !== '' }"
          type="text"
          v-model="streamerNameEdit"
          size="10"
          placeholder="SovietWomble"
          @input="checkStreamerStatus"
          @keypress.enter="saveWatcher"
        />
        <img
          :src="streamerAvatar"
          alt="streamer avatar"
          class="streamer-avatar"
        />
      </div>
    </div>
    <div>
      <p>{{$t("WATCHER.TITLE-CONTAINS")}}</p>
      <input
        class="title-filter-input"
        type="text"
        v-model="titleFilterEdit"
        size="15"
        :placeholder="$t('WATCHER.TITLE-CONTAINS-PLACEHOLDER')"
        @keypress.enter="saveWatcher"
      />
    </div>
    <div class="watcher-options">
      <button :disabled="!canSave" class="btn btn-primary" @click="saveWatcher">
        {{$t("BUTTONS.SAVE")}}
      </button>
      <button class="btn btn-danger" @click="removeWatcher">{{$t("BUTTONS.REMOVE")}}</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { debounce } from 'lodash'

export default {
  data () {
    return {
      streamerNameEdit: '',
      titleFilterEdit: '',
      streamer: undefined,
      saving: false
    }
  },
  props: {
    id: {
      type: String
    },
    streamerName: {
      type: String,
      default: ''
    },
    titleFilter: {
      type: String,
      default: ''
    }
  },
  mounted () {
    this.streamerNameEdit = this.streamerName
    this.titleFilterEdit = this.titleFilter

    this.checkStreamerStatus()
  },
  created () {
    this.checkStreamerStatus = debounce(
      this.checkStreamerStatus.bind(this),
      500
    )
  },
  computed: {
    streamerAvatar () {
      return this.streamer?.profileImageURL
    },
    canSave () {
      return (
        !this.saving &&
        this.streamer &&
        (this.streamerNameEdit !== this.streamerName ||
          this.titleFilterEdit !== this.titleFilter)
      )
    }
  },
  watch: {
    streamerNameEdit (newName, oldName) {
      if (oldName.toLowerCase() !== newName.toLowerCase()) {
        this.streamer = null
      }
    }
  },
  methods: {
    ...mapActions(['getStreamerStatus']),
    async checkStreamerStatus () {
      if (this.streamerNameEdit === '') {
        return
      }
      /**
       * @type {twitchUserType?}
       */
      const streamerStatus = await this.getStreamerStatus(
        this.streamerNameEdit
      )
      this.streamer = streamerStatus
      if (this.streamer?.displayName) {
        this.streamerNameEdit = this.streamer.displayName
      }
    },
    saveWatcher () {
      if (!this.canSave) {
        return
      }
      this.$emit('saving', this.streamerNameEdit, this.titleFilterEdit)
      this.saving = true
      setInterval(() => {
        this.saving = false
      }, 1500)
    },
    removeWatcher () {
      this.$emit('removing')
    }
  }
}

/**
 * @typedef {{
 *  channel: {
 *    id: string;
 *    chanlets: any;
 *  };
 *  id: string;
 *  isPartner: boolean;
 *  lastBroadcast: {
 *    id: string;
 *    title: string;
 *  };
 *  primaryColorHex: string;
 *  primaryTeam: {};
 *  profileImageURL: string;
 *  squadStream: any;
 *  stream: {
 *    id: string;
 *    type: string;
 *    createdAt: string;
 *  }
 * }} twitchUserType
 */
</script>

<style>
.watcher {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  margin-bottom: 5px;
  background-color: hsl(216, 7%, 17%);
  border-radius: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.watcher > div {
  display: flex;
  height: 100%;
}

.watcher p {
  margin: 0px;
}

.watcher .streamer-input {
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.watcher .streamer-avatar {
  z-index: 999;
  transform: translateY(-50%);
  border-radius: 50%;
  margin: -15px;
  position: absolute;
  float: left;
  opacity: 0;
  pointer-events: none;
}

.watcher input:focus + .streamer-avatar[src] {
  opacity: 1;
  transform: translateY(-100%);
}

.watcher input + .streamer-avatar[src] {
  transition: opacity 0.5s, transform 0.5s;
}

.watcher .streamer-input > input.invalid {
  border-color: red;
  background-color: #aa6666;
}

.watcher .title-filter-input {
  margin-left: 5px;
}

.watcher .watcher-options {
  height: 100%;
  flex-shrink: 1;
  align-items: center;
  justify-content: center;
  display: inline-block;
}
</style>

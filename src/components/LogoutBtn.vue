<template>
  <div class="logout" @click="logout">
    <img class="user-avatar" :src="imageUrl" alt="" />
    <div class="logoutBtn" title="Logout">
      <img src="../assets/logout.svg" alt="logout" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['logout'])
  }
}
</script>

<style>
.logout {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.logout .logoutBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
}

.logout:hover .logoutBtn {
  scale: 0.5;
  opacity: 1;
  position: fixed;
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 50%;
  transition: opacity 0.25s;
}

.logout:hover .logoutBtn img {
  max-height: 25px;
  max-width: 25px;
}

.logout .user-avatar {
  max-height: 50px;
  max-width: 50px;
  border-radius: 50%;
}
</style>

<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <h4>counter is</h4>
    <h3>{{$store.state.counter}}</h3>
    <h3>{{$store.getters.doubleCounter}}</h3>
    <button @click="$store.commit('add')">mutations</button>
    <button @click="$store.state = 3">setState</button>
    <button @click="$store.dispatch('add')">actions</button>
    <button @click="showNotice">showNotice</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    showNotice() {
      this.$notice({
        title: 'I am a Notice',
        message: 'ahahhaha',
        duration: 3000
      });
    }
  }
};
</script>

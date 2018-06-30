<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to Eye Time project!
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc center">
          <div class="title">Set Timer</div>
          <p>
            <input class="time" v-model="minutes" placeholder="Set work time">
          </p>
          <button @click="start" v-if="!isStarted">Start Timer</button>
          <button class="stop" @click="stop" v-if="isStarted">Stop Timer</button>
          <p class="left-time"><span>Work time left: {{ timeLeft }}</span></p>
          <br>
          <br>
        </div>
        <div class="doc center">
          <div class="title alt">Other Actions</div>
          <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Electron+Vue</button>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
          
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation';

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    data() {
      return {
        isStarted: false,
        minutes: 30,
        timeLeft: 0,
      };
    },
    methods: {
      start() {
        this.isStarted = true;
      },
      stop() {
        this.isStarted = false;
      },
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
p.left-time {
  margin: 10px;
}
.center {
  text-align: center;
}

input {
  padding: 10px;
  text-align: center;
}

input.time {
  font-weight: bold;
  border-radius: 5px;
  border-color: lightgray;
  border-style: solid;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}
.doc button:hover {
  background-color: #3eaa79;
  border: 1px solid #3b916a;
}

button.stop {
  background-color: #eb4e43;
  border: 1px solid #c0c0c0;
}
button.stop:hover {
  background-color: #d44035;
  border: 1px solid #8d8d8d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>

<template>
  <div id="wrapper">
    
    <main>
      <div class="center">
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
      </div>
      <div class="center">
        <div class="doc center">
          <div class="title">Set Work Time</div>
          <p>
            <input class="time" v-model="workMinutes" placeholder="in minutes">
          </p>
        </div>
        <div class="doc center">
          <div class="title alt">Set Rest Time</div>
          <p>
            <input class="time" v-model="restMinutes" placeholder="in minutes">
          </p>

          <p class="left-time"><span>Work time left: {{ timeLeft }}</span></p>

          <button class="main-btn" @click="start" v-if="!isStarted">Start Work</button>
          <button class="main-btn stop" @click="stop" v-if="isStarted">Stop Timer</button>
<!-- 
          <button @click="open('https://simulatedgreg.gitbooks.io/electron-vue/content/')">Electron+Vue</button>
          <button class="alt" @click="open('https://electron.atom.io/docs/')">Electron</button>
          <button class="alt" @click="open('https://vuejs.org/v2/guide/')">Vue.js</button>
           -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { Howl } from 'howler';
// import SystemInformation from './LandingPage/SystemInformation';
// const sounds = require.context('../assets/'.false, /\.mp3$/);
const endTime = require('../assets/endTime.mp3');

export default {
  name: 'landing-page',
  // components: { SystemInformation },
  data() {
    return {
      isStarted: false,
      workMinutes: 30,
      restMinutes: 5,
      timeLeft: '00:00',
      secondsLeft: 0,
      workTimerId: {},
      restTimerId: {},
      mainWindow: {},
    };
  },
  methods: {
    start() {
      // Получаем текущее окно (из index.js)
      // https://electron.atom.io/docs/api/browser-window/#browserwindowgetfocusedwindow
      this.mainWindow = this.$electron.remote.BrowserWindow.getFocusedWindow();

      this.isStarted = true;

      this.hideWindow();

      this.secondsLeft = this.workMinutes * 60;
      this.calcWorkTime();

      this.workTimerId = setInterval(() => {
        // Уменьшаем время
        this.secondsLeft -= 1;
        this.calcWorkTime();

        // Если времени больше не осталось, то стопорим всё
        if (this.secondsLeft <= 0) {
          clearInterval(this.workTimerId);
          this.playEndWork();
          this.showWindow();
          this.isStarted = false;
        }
      }, 1000);
    },
    stop() {
      this.isStarted = false;
      clearInterval(this.workTimerId);
    },
    playEndWork() {
      // https://github.com/goldfire/howler.js#quick-start
      const sound = new Howl({
        src: [endTime],
      });
      sound.play();
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    calcWorkTime() {
      const minutes = Math.floor(this.secondsLeft / 60)
        .toString().padStart(2, '0');
      const seconds = (this.secondsLeft % 60).toFixed(0)
        .toString().padStart(2, '0');
      this.timeLeft = `${minutes}:${seconds}`;
    },
    showWindow() {
      // Вытащить из трея
      this.mainWindow.show();

      // Почему-то не работает
      // Сделать поверх всех на 1 сек
      this.mainWindow.setAlwaysOnTop(true);
      // once show then it leaves from top when click outside
      setTimeout(() => {
        this.mainWindow.setAlwaysOnTop(false);
      }, 1000);
    },
    hideWindow() {
      // Вытащить из трея
      this.mainWindow.minimize();
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
  height: 100px;
  margin-bottom: 20px;
}

main {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
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

.main-btn {
  width: 125px;
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

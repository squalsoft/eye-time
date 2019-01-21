<template>
  <div id="wrapper" :class="{ work:isWorkingTime, rest: !isWorkingTime }">
    <main>
      <div class="center logo">
        <img v-if="state === 0" id="logo" src="~@/assets/logo.png" alt="eye">
        <img class="state" v-if="isWorkingTime && state !== 0" src="~@/assets/hammer.svg">
        <img class="state" v-if="!isWorkingTime && state !== 0" src="~@/assets/palms.png">
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

          <p class="left-time">
            <span v-if="isWorkingTime">Work time left: {{ timeLeft }}</span>
            <span v-if="!isWorkingTime">Rest time left: {{ timeLeft }}</span>
          </p>

          <div class="controls">
            <button v-if="state !== 1" class="main-btn" @click="start" title="Start Work">
              <img src="~@/assets/play.svg">
            </button>
            <button
              v-if="state !== 2 && state !==0"
              class="main-btn pause"
              @click="pause"
              title="Pause Timer"
            >
              <img src="~@/assets/pause.svg">
            </button>
            <button v-if="state !== 0" class="main-btn stop" @click="stop" title="Stop Timer">
              <img src="~@/assets/stop.svg">
            </button>
            <button v-if="state !== 0" class="main-btn skip" @click="skip" title="Skip interval">
              <img src="~@/assets/skip.svg">
            </button>
          </div>

          <!-- 
          <button @click='open('https://simulatedgreg.gitbooks.io/electron-vue/content/')'>Electron+Vue</button>
          <button class='alt' @click='open('https://electron.atom.io/docs/')'>Electron</button>
          <button class='alt' @click='open('https://vuejs.org/v2/guide/')'>Vue.js</button>
          -->
        </div>
      </div>
    </main>
  </div>
</template>


<script lang='ts'>
interface Window {
  require: any;
}
declare var window: Window;

import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { Howl } from 'howler';

// Хак https://github.com/electron/electron/issues/7300
const electron = (window as any).require('electron');
const { remote, BrowserWindow } = electron;
// import {remote, BrowserWindow} from 'electron';
// const { remote, BrowserWindow } = window.require('electron');

// tslint:disable-next-line:no-var-requires
const endTime = require('../assets/endTime.mp3');
// tslint:disable-next-line:no-var-requires
const startWork = require('../assets/bell.mp3');

@Component({
  components: {}
})
export default class Home extends Vue {
  // data
  public isWorkingTime: boolean = true;
  /** 0 - stop, 1 - play, 2 - pause */
  public state: number = 0;
  public workMinutes: number = 30;
  public restMinutes: number = 5;
  public timeLeft: string = '00:00';
  public secondsLeft: number = 0;
  // ! - definite assignment assertion
  private workTimerId!: number;
  private restTimerId!: number;
  private mainWindow: any;

  // lifecycle hook
  // public mounted() {}

  // computed
  // get computedMsg () {
  //   return 'computed ' + this.msg
  // }

  // methods
  public start(): void {
    // Получаем текущее окно (из index.js)
    // https://electron.atom.io/docs/api/browser-window/#browserwindowgetfocusedwindow
    this.mainWindow = remote.BrowserWindow.getFocusedWindow();

    this.recalcSecondsLeft();

    this.state = 1;

    if (this.isWorkingTime) {
      this.hideWindow();
    }

    this.calcWorkTime();

    this.workTimerId = setInterval(() => {
      // Уменьшаем время
      this.secondsLeft -= 1;
      this.calcWorkTime();

      // Если времени больше не осталось, то стопорим всё
      if (this.secondsLeft <= 0) {
        this.secondsLeft = 0;
        // clearInterval(this.workTimerId);
        if (this.isWorkingTime) {
          this.playEndWork();
          this.showWindow();
        } else {
          this.playStartWork();
          this.hideWindow();
        }
        // this.state = 0;
        // Меняем тип интервала
        this.isWorkingTime = !this.isWorkingTime;
        this.recalcSecondsLeft();
      }
    }, 1000);
  }

  public recalcSecondsLeft() {
    if (this.state !== 2) {
      // Если не сняли с паузы
      // Пересчёт времени заново
      if (this.isWorkingTime) {
        this.secondsLeft = this.workMinutes * 60;
      } else {
        this.secondsLeft = this.restMinutes * 60;
      }
    }
  }

  public pause(): void {
    this.state = 2;
    clearInterval(this.workTimerId);
  }
  public stop(): void {
    this.state = 0;
    clearInterval(this.workTimerId);
  }
  public skip(): void {
    this.secondsLeft = 0;
  }
  public playEndWork(): void {
    // https://github.com/goldfire/howler.js#quick-start
    const sound = new Howl({
      src: [endTime]
    });
    sound.play();
  }
  public playStartWork(): void {
    const sound = new Howl({
      src: [startWork]
    });
    sound.play();
  }
  // open(link:string) : void {
  //   this.$electron.shell.openExternal(link);
  // }
  public calcWorkTime(): void {
    if (this.secondsLeft < 0) {
      this.secondsLeft = 0;
    }
    const minutes = Math.floor(this.secondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.secondsLeft % 60)
      .toFixed(0)
      .toString()
      .padStart(2, '0');
    this.timeLeft = `${minutes}:${seconds}`;
  }
  public showWindow(): void {
    // Вытащить из трея
    this.mainWindow.show();

    // Почему-то не работает
    // Сделать поверх всех на 1 сек
    this.mainWindow.setAlwaysOnTop(true);
    // once show then it leaves from top when click outside
    // setTimeout(() => {
    //   this.mainWindow.setAlwaysOnTop(false);
    // }, 1000);
  }
  public hideWindow(): void {
    // Свернуть в трей
    this.mainWindow.minimize();
    this.mainWindow.setAlwaysOnTop(false);
  }
}
</script>

<style scoped lang='less'>
// @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');
p.left-time {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
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

// body {
//   margin: 0px;
//   //    font-family: 'Source Sans Pro', sans-serif;
// }

.work {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
}
#wrapper {
  height: 100vh;
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: 100px;
  margin-bottom: 20px;
}
.state {
  height: 100px;
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
.controls {
  button {
    margin: 5px;
  }
}

.rest {
  background: radial-gradient(ellipse at top left, #d6ffd6 40%, #66de66 100%);
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
  background-color: #26a6d1;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}
.doc button:hover {
  background-color: #49c1e9;
  border: 1px solid #3b916a;
}

button.pause {
  background-color: #f5f244;
  border: 1px solid #c0c0c0;
}
button.pause:hover {
  background-color: #f8f686;
  border: 1px solid #8d8d8d;
}

button.stop {
  background-color: #eb4e43;
  border: 1px solid #c0c0c0;
}
button.stop:hover {
  background-color: #ff837a;
  border: 1px solid #8d8d8d;
}

button.skip {
  background-color: #c4f5b8;
  border: 1px solid #c0c0c0;
}
button.skip:hover {
  background-color: #e3fddd;
  border: 1px solid #c0c0c0;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>

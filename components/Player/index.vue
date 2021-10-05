<template>
  <b-navbar
    v-if="this.$store.state.reproduzindo.currentAudio"
     toggleable="lg"
     type="dark"
     variant="dark"
     fixed="bottom"
     class="m-0 navbar-player">
    <b-container fluid>
      <b-container>

        <b-row class="w-100">
          <b-col md="4">
            <div class="flex-fill box-actions mt-2">
              <b-img v-bind="mainProps" rounded alt=""></b-img>
              <b-button @click="prev"><b-icon icon="skip-start-fill"></b-icon></b-button>
              <b-button v-if="!reproduzindo" @click="play" class="play"><b-icon icon="play-fill"></b-icon></b-button>
              <b-button v-if="reproduzindo" @click="pause"><b-icon icon="pause"></b-icon></b-button>
              <b-button @click="next"><b-icon icon="skip-end-fill"></b-icon></b-button>

              <b-dropdown no-caret dropup>
                <template #button-content>
                  <b-icon icon="volume-up-fill"></b-icon>
                </template>

                <b-dropdown-form class="p-0">
                  <input
                    type="range"
                    v-model="volume"
                    @mousemove="setVolume(volume)"
                    min="0"
                    step="0.1"
                    max="1"
                    class="form-control-range p-0">
                </b-dropdown-form>
              </b-dropdown>
            </div>
          </b-col>

          <b-col md="4">
            <div class="flex-fill flex-grow-1">
              <div class="nome-reproduzindo">{{this.$store.state.reproduzindo.currentAudio.nome}}</div>
              <div class="d-flex flex-row justify-content-between align-items-center infor-reproducao">
                <div class="tempoAtual">{{miliSec(tempoAtual)}}</div>

                <div class="w-100 ml-2 mr-2 position-relative">
                  <b-progress height="4px" :value="tempoAtual" :max="duracao" class="progress-duracao position-absolute w-100" />
                  <b-form-input
                    v-model="tempoAtual"
                    type="range"
                    min="0"
                    :max="duracao"
                    @click="nextProgress(tempoAtual)"
                    class="position-relative"></b-form-input>
                </div>
                <div class="tempoDuracao">{{miliSec(duracao)}}</div>
              </div>
            </div>
          </b-col>

          <b-col md="4">
            <div v-show="showPlayerGeral" class="box-player-geral">
              <vue-plyr ref="plyr" >
                <audio controls crossorigin preload playsinline :src="this.$store.state.reproduzindo.currentAudio.src"></audio>
              </vue-plyr>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  data () {
    return {
      settings: ['captions', 'quality', 'speed', 'loop'],
      options: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      player: [],
      reproduzindo: false,
      showPlayerGeral: true,
      mainProps: { blank: true, blankColor: '#777', width: 35, height: 35, class: 'm1' },
      tempoAtual: '0.00',
      duracao: '0.00',
      key: 0,
      reload: false,
      volume: 1
    }
  },
  mounted () {
    this.player = this.$refs.plyr.player
    this.volume = this.player.volume
    this.update()

    this.player.on('ended', () => {
      if ((this.key + 1) <= (this.$store.state.reproduzindo.list.length - 1)) {
        this.next()
      } else if (this.reload && ((this.key + 1) > (this.$store.state.reproduzindo.list.length - 1))) {
        this.key = 0
        this.update()
        this.play()
      }
    })

    this.player.on('progress', () => {
      this.tempoAtual = Number(this.player.currentTime)
      this.duracao = Number(this.player.duration)
    })

    this.player.on('timeupdate', () => {
      if (this.player.playing) {
        this.tempoAtual = Number(this.player.currentTime)
      }
    })

    this.$nuxt.$on('novareproducao', () => {
      this.updateExterno()
    })
  },
  methods: {
    add () {

    },
    next () {
      if (this.key + 1 < this.$store.state.reproduzindo.list.length) {
        this.key++
      } else {
        this.key = 0
      }
      this.update()
      if (this.player.playing) {
        this.play()
      }
    },
    prev () {
      if (this.key - 1 >= 0) {
        this.key--
      } else {
        this.key = this.$store.state.reproduzindo.list.length - 1
      }
      this.update()

      if (this.player.playing) {
        this.play()
      }
    },
    play () {
      // const playPromise = this.player.play()
      const playPromise = this.$refs.plyr.player.play()
      this.player.autoplay = true

      console.log(playPromise)
      // if (playPromise !== undefined) {
      //   playPromise.then((_) => {
      //     this.pause()
      //   }).catch((error) => {
      //     console.log(error)
      //   })
      // }
      if (this.player.playing) {
        this.reproduzindo = true
        this.duracao = this.player.duration
      }
    },
    update () {
      const currentAudio = this.$store.state.reproduzindo.list[this.key]
      if (currentAudio) {
        this.$store.commit('reproduzindo/addCurrent', currentAudio)

        this.player.source = {
          type: 'audio',
          title: currentAudio.nome,
          sources: [
            {
              src: currentAudio.src,
              type: 'audio/mp3'
            }
          ]
        }
      }
    },
    updateExterno () {
      const currentAudio = this.$store.state.reproduzindo.currentAudio
      if (currentAudio) {
        this.player.source = {
          type: 'audio',
          title: currentAudio.nome,
          sources: [
            {
              src: currentAudio.src,
              type: 'audio/mp3'
            }
          ]
        }
      }
      this.play()
    },
    async pause () {
      await this.player.pause()
      this.reproduzindo = false
      this.player.autoplay = false
    },
    async nextProgress (val) {
      this.player.currentTime = val
      if (val < this.player.currentTime) {
        await this.player.rewind(Number(val))
      } else if (val > this.player.currentTime) {
        await this.player.forward(Number(val))
      }
    },
    setVolume (vol) {
      console.log(vol)
      this.player.volume = vol
    },
    miliSec (millis) {
      const horas = Math.floor(millis / (60 * 60))

      let resto = millis % (60 * 60)
      const minutos = Math.floor(millis / 60)

      resto %= 60
      const segundos = Math.ceil(resto)

      return `${(horas ? horas + ':' : '')}${(minutos < 10 ? '0' + minutos : minutos)}:${(segundos < 10 ? '0' + segundos : segundos)}`
    }
  }
}
</script>

<style>
  .navbar-player{

  }

  .box-actions{
    text-align: center;
  }

  .box-actions button{
    background: transparent !important;
    border: none;
  }

  .box-actions button:hover{
    background: #222 !important;
  }

  .box-actions .play{
  }

  .nome-reproduzindo{
    text-align: center;
    color:#FFF;
  }

  .infor-reproducao{
    color:#FFF;
  }

  .nome-reproduzindo{
    font-size: 13px;
  }

  .tempoAtual{
    font-size: 12px;
  }

  .tempoDuracao{
    font-size: 12px;
  }

  .custom-range::-moz-range-track{
    background-color: transparent !important;
  }

  .custom-range::-webkit-slider-runnable-track{
    -webkit-appearance: none;
    background-color: transparent !important;
  }

  .progress-duracao{
    top:10px;
    background-color: #f2f2f23b !important;
  }

  .custom-range::-moz-range-thumb, .custom-range::-webkit-slider-runnable-track {
    background: #00c5a2;
  }

  .custom-range .progress-bar{
    background: #00c5a2 !important;
  }
</style>

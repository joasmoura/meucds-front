<template>
  <div>
    <headerArtista :cd="cd" :artista="artista" v-on:ouvirCd="ouvir" v-on:baixarCd="baixarCd" :baixando="baixando" />

    <b-container>
      <h1 class="titulo">Música: {{(musica ? musica.nome : '')}}</h1>

      <b-row>
        <b-col md="8" v-html="(musica ? musica.letra : '')"></b-col>

        <b-col md="4"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import HeaderArtista from '@/components/Artistas/header.vue'
export default {
  data () {
    return {
      artista: [],
      uri: '',
      uriCd: '',
      uriArtista: '',
      cd: [],
      musica: [],
      keyMusica: 0,
      baixando: false
    }
  },
  created () {
    this.uriArtista = this.$route.params.artista
    this.uriCd = this.$route.params.cd
    this.uri = this.$route.params.musica
    this.getArtista()
  },
  components: {
    HeaderArtista
  },
  methods: {
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uriArtista === a.url)
      if (artista) {
        this.artista = artista

        const cd = artista.cds.find(c => c.url === this.uriCd)
        if (cd) {
          this.cd = cd

          for (const i in cd.musicas) {
            if (cd.musicas[i].url === this.uriArtista + '/' + this.uriCd + '/' + this.uri) {
              this.musica = cd.musicas[i]
              break
            }
          }
        }
      } else {
        await this.$axios.get(`artista/${this.uriArtista}`).then((r) => {
          this.$store.commit('artista/add', r.data.artista)
          this.artista = r.data.artista
          this.load = false

          const cd = this.artista.cds.find(c => c.url === this.uriCd)
          if (cd) {
            this.cd = cd

            for (const i in cd.musicas) {
              if (cd.musicas[i].url === this.uriArtista + '/' + this.uriCd + '/' + this.uri) {
                this.musica = cd.musicas[i]
                this.keyMusica = i
                break
              }
            }
          }
        }).catch((error) => {
          console.log(error)
          // this.$router.push('/')
        })
      }
    },
    ouvir () {
      const musicas = this.cd.musicas
      if (Object.entries(musicas).length > 0) {
        this.$store.commit('reproduzindo/limpar')

        const publicidade = this.$store.state.publicidade.list.filter(c => parseInt(this.cdAtual.id) === parseInt(c.cd_id))
        if (publicidade.length) {
          publicidade.forEach((p) => {
            this.$store.commit('reproduzindo/add', {
              id: p.id,
              cd_id: this.cdAtual.id,
              src: p.src,
              type: p.origem,
              nome: p.titulo,
              link: p.link
            })
          })
        }

        for (const key in musicas) {
          this.$store.commit('reproduzindo/add', {
            id: musicas[key].id,
            cd_id: musicas[key].cd_id,
            src: musicas[key].link_musica,
            type: 'audio/mp3',
            nome: musicas[key].nome,
            url: musicas[key].url,
            capa: this.cdAtual.capa_mini
          })
        }
        this.$nuxt.$emit('novareproducao', this.keyMusica)
        this.contaPlayCd()
      }
    },
    contaDownloadCd () {
      this.$axios.get(`conta-download-cd/${this.cd.id}`).then((r) => {
        const numDownloads = r.data
        if (numDownloads) {
          this.$store.commit('artista/setDownloadsCd', { cd: this.cd, numDownloads })
        }
      }).catch(() => {
        console.log('erro')
      })
    },
    contaPlayCd () {
      this.$axios.get(`conta-play-cd/${this.cd.id}`).then((r) => {
        const numPlays = r.data
        if (numPlays) {
          this.$store.commit('artista/setPlaysCd', { cd: this.cd, numPlays })
        }
      }).catch(() => {
        console.log('erro')
      })
    },
    baixarCd () {
      this.baixando = true
      this.$axios.get('/baixar-cd', {
        params: {
          artista: this.artista.url,
          cd: this.cd.url
        },
        responseType: 'blob'
      }).then((r) => {
        const blob = new Blob([r.data], { type: 'application/zip' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = this.cd.titulo + '.zip'
        link.click()
        URL.revokeObjectURL(link.href)
        this.baixando = false
        this.contaDownloadCd()
      }).catch(() => {
        this.baixando = false
        alert('Algo deu errado ao baixar este CD!')
      })
    }
  }
}
</script>

<style>
  .titulo{
    font-size: 25px;
  }
</style>

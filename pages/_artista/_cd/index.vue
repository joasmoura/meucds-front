<template>
  <div>
    <headerArtista :artista="artista" :cd="cdAtual" v-on:ouvirCd="ouvir" v-on:baixarCd="baixarCd" :baixando="baixando"/>

    <b-container fluid="lg">
      <b-row class="mt-3">
        <b-col md="7">
          <h3>Músicas do album</h3>
          <b-overlay v-if="load || (artista && Object.entries(artista).length > 0) " :show="load" rounded="sm" style="min-height:200px">
            <musicas
              v-for="(musica, key) in cdAtual.musicas"
              :key="key"
              :id="key"
              :musica="musica"
              :numero="renderNumero(key)"
              v-on:ouvir="(e) => ouvir(e)" />
          </b-overlay>
        </b-col>

        <b-col md="5">
          <iframe v-if="cdAtual && cdAtual.youtube" class="frameYoutube" :src="`https://www.youtube.com/embed/${cdAtual.youtube}`" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import HeaderArtista from '@/components/Artistas/header.vue'
export default {
  data () {
    return {
      artista: null,
      uri: '',
      cdAtual: null,
      uriArtista: '',
      load: false,
      baixando: false
    }
  },
  created () {
    this.uri = this.$route.params.cd
    this.uriArtista = this.$route.params.artista
    this.getArtista()
  },
  components: {
    HeaderArtista
  },
  methods: {
    ouvir (k = 0) {
      const musicas = this.cdAtual.musicas
      if (Object.entries(musicas).length > 0) {
        this.$store.commit('reproduzindo/limpar')

        const publicidade = this.$store.state.publicidade.list.filter(c => parseInt(this.cdAtual.id) === parseInt(c.cd_id))
        if (Array.from(publicidade).length) {
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
        this.$nuxt.$emit('novareproducao', k)
        this.contaPlayCd()
      }
    },
    baixarCd () {
      this.baixando = true
      this.$axios.get('/baixar-cd', {
        params: {
          artista: this.artista.url,
          cd: this.cdAtual.url
        },
        responseType: 'blob'
      }).then((r) => {
        const blob = new Blob([r.data], { type: 'application/zip' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = this.cdAtual.titulo + '.zip'
        link.click()
        URL.revokeObjectURL(link.href)
        this.baixando = false
        this.contaDownloadCd()
      }).catch(() => {
        this.baixando = false
        alert('Algo deu errado ao baixar este CD!')
      })
    },
    contaDownloadCd () {
      this.$axios.get(`conta-download-cd/${this.cdAtual.id}`).then((r) => {
        const numDownloads = r.data
        if (numDownloads) {
          this.$store.commit('artista/setDownloadsCd', { cd: this.cdAtual, numDownloads })
        }
      }).catch(() => {
        console.log('erro')
      })
    },
    contaPlayCd () {
      this.$axios.get(`conta-play-cd/${this.cdAtual.id}`).then((r) => {
        const numPlays = r.data
        if (numPlays) {
          this.$store.commit('artista/setPlaysCd', { cd: this.cdAtual, numPlays })
        }
      }).catch(() => {
        console.log('erro')
      })
    },
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uriArtista === a.url)
      if (artista) {
        this.artista = artista

        const cdAtual = artista.cds.find(cd => cd.url === this.uri)
        if (cdAtual) {
          this.cdAtual = cdAtual
        }
      } else {
        await this.$axios.get(`artista/${this.uriArtista}`).then((r) => {
          this.$store.commit('artista/add', r.data.artista)
          this.artista = r.data.artista
          const cdAtual = this.artista.cds.find(cd => cd.url === this.uri)
          if (cdAtual) {
            this.cdAtual = cdAtual

            const publicidade = r.data.publicidade
            if (Array.from(publicidade).length > 0) {
              publicidade.forEach((p) => {
                this.$store.commit('publicidade/add', p)
              })
            }
          }
          this.load = false
        }).catch((error) => {
          console.log(error)
          this.$router.push('/')
        })
      }
    },
    renderNumero (key) {
      return parseInt(key) + 1
    }
  }
}
</script>

<style>
  .frameYoutube{
    width: 100%;
    height: 250px;
  }
</style>

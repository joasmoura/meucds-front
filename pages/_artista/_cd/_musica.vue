<template>
  <div>
    <headerArtista :cd="cd" :artista="artista"/>

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
      musica: []
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
            if (cd.musicas[i].url === this.uri) {
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
              if (cd.musicas[i].url === this.uri) {
                this.musica = cd.musicas[i]
                break
              }
            }
          }
        }).catch((error) => {
          console.log(error)
          // this.$router.push('/')
        })
      }
    }
  }
}
</script>

<style>
  .titulo{
    font-size: 25px;
  }
</style>

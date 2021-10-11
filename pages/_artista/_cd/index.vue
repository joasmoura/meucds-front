<template>
  <div>
    <headerArtista :artista="artista" />

    <b-container fluid="lg">
      <b-row>
        <b-col md="8">
          <h3>Músicas do album</h3>
          <b-overlay v-if="load || (artista && Object.entries(artista).length > 0) " :show="load" rounded="sm" style="min-height:200px">
            <musicas :musicas="cdAtual.musicas" origem="cd" />
          </b-overlay>
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
      artista: [],
      uri: '',
      cdAtual: null,
      uriArtista: '',
      load: false
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
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uri === a.url)
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
          this.load = false

          const cdAtual = this.artista.cds.find(cd => cd.url === this.uri)
          if (cdAtual) {
            this.cdAtual = cdAtual

            const publicidade = r.data.publicidade
            if (publicidade.length > 0) {
              publicidade.forEach((p) => {
                const store = this.$store.state.publicidade.list.find(a => parseInt(cdAtual.id) === parseInt(a.cd_id))
                if (!store) {
                  this.$store.commit('publicidade/add', p)
                }
              })
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

</style>

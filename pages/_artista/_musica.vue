<template>
  <div>
    <headerArtista :artista="artista" />
    <h1>Música</h1>
  </div>
</template>

<script>
import HeaderArtista from '@/components/Artistas/header.vue'
export default {
  data () {
    return {
      artista: [],
      uri: ''
    }
  },
  created () {
    this.uri = this.$route.params.artista
    this.getArtista()
  },
  components: {
    HeaderArtista
  },
  methods: {
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uri === a.url)
      console.log(artista)
      if (artista) {
        this.artista = artista
      } else {
        await this.$axios.get(`artista/${this.uri}`).then((r) => {
          this.$store.commit('artista/add', r.data.artista)
          this.artista = r.data.artista
          this.load = false
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

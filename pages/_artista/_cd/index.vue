<template>
  <div>
    <headerArtista :artista="artista" :cd="cdAtual" v-on:ouvirCd="ouvir"/>

    <b-container fluid="lg">
      <b-row class="mt-3">
        <b-col md="7">
          <h3>Músicas do album</h3>
          <b-overlay v-if="load || (artista && Object.entries(artista).length > 0) " :show="load" rounded="sm" style="min-height:200px">
            <musicas :musicas="cdAtual.musicas" origem="cd"/>
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
    ouvir () {
      const musicas = this.cdAtual.musicas
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
            nome: musicas[key].nome
          })
        }
        this.$nuxt.$emit('novareproducao', 0)
      }
    },
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
                this.$store.commit('publicidade/add', p)
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
  .frameYoutube{
    width: 100%;
    height: 250px;
  }
</style>

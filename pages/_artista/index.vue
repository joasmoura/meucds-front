<template>
<div>
  <b-container fluid class="banner-artista"></b-container>
  <b-container class="infos-artista p-5 d-md-flex flex-row justify-content-between">
    <div class="d-md-flex flex-row justify-content-between align-content-center align-items-center">
      <b-skeleton v-if="!Object.entries(artista).length" type="avatar"></b-skeleton>
      <b-avatar v-if="Object.entries(artista).length > 0" :src="artista.foto" size="6rem" :alt="`Artista ${artista.nome}`"></b-avatar>

      <div class="ml-3">
        <h1 class="nome-artista">{{artista.nome}}</h1>
      </div>
    </div>

    <div class="d-md-flex flex-row ju.lenstify-content-between align-content-center align-items-center">
      <div class="pr-3">
        <h4 class="num-dado">1000</h4>
        <span class="nome-dado">Reproduções</span>
      </div>

      <div>
        <h4 class="num-dado">1000</h4>
        <span class="nome-dado">Downloads</span>
      </div>
    </div>
  </b-container>

  <b-container class="bg-white">
    <b-nav pills>
      <b-nav-item :to="`${uri}/albuns`">Albuns</b-nav-item>
      <b-nav-item>Vídeos</b-nav-item>
    </b-nav>
  </b-container>

  <b-container class="lista-cds">
    <b-row>
      <b-col md="9">
        <b-overlay v-if="load || (artista && Object.entries(artista).length > 0) " :show="load" rounded="sm" style="min-height:200px">
          <musicas :musicas="artista.musicas" origem="todas" />
        </b-overlay>
      </b-col>

      <b-col md="3">
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  data () {
    return {
      artista: [],
      cds: [],
      uri: '',
      currentPage: 1,
      load: false
    }
  },
  components: {

  },
  // async asyncData ({ params, $axios, redirect }) {
  //   const uri = params.artista
  //   let artistas = []

  //   return { artistas }
  // },
  head () {
    return {
      title: (this.artista ? this.artista.nome : '') + ' - Meu Cds',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'My custom description'
        }
      ]
    }
  },
  created () {
    this.uri = this.$route.params.artista
    this.getArtista()
  },
  methods: {
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uri === a.url)

      if (artista) {
        this.artista = artista
      } else {
        this.load = true
        await this.$axios.get(`artista/${this.uri}`).then((r) => {
          this.$store.commit('artista/add', r.data.artista)
          this.artista = r.data.artista
          this.load = false
        }).catch((error) => {
          console.log(error)
          this.$router.push('/')
        })
      }
    }
  }
}
</script>

<style>

  .banner-artista{
    height: 200px;
    background: orange;
  }

  .infos-artista{
    margin-top: -30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 .5em #ccc;
  }

  .infos-artista .nome-artista{
    font-size: 1.3em;
  }

  .infos-artista .num-dado{
    font-weight: bold;
    color: #00C5A2;
    font-size: 20px;
    margin: 0;
  }

  .infos-artista .nome-dado{
    font-size: 15px;
    color: #00C5A2;

  }
</style>

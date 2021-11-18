<template>
<div>
  <headerArtista :artista="artista" />

  <b-container>
    <h3>Albuns do {{(artista && artista.tipo === 'A' ? 'Artista' : 'Divulgador')}}</h3>
    <b-row v-if="artista && Array.from(artista.cds).length">
      <b-col v-for="(cd, key) in artista.cds" :key="cd.id" md="2" @mouseenter="ativaBotaoPlay(key)" @mouseleave="desativaBotaoPlay(key)" >
        <b-button :id="`cd-${key}`" class="botaoPlay" @click="ouvir(cd.id)" v-b-tooltip.hover title="Escutar">
          <b-icon icon="play-fill"></b-icon>
        </b-button>

        <b-link :to="`${uri}/${cd.url}`">
          <b-card
            :title="titulos(cd.titulo)"
            :img-src="(cd.capa_mini ? cd.capa_mini : '/capa-cd.jpg')"
            :img-alt="cd.titulo"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2 box-cd"
          >
            <b-card-text>
              <div v-if="cd.musicas">
                {{Array.from(cd.musicas).length}} músicas
              </div>

              <span v-else>0 músicas</span>
            </b-card-text>
          </b-card>
        </b-link>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import HeaderArtista from '@/components/Artistas/header.vue'
export default {
  // async asyncData ({ store, params }) {
  //   const param = params.artista
  //   let artista = store.state.artista.list.find(a => param === a.url)

  //   if (!artista) {
  //     artista = await store.dispatch('artista/getArtista', param)
  //   }
  //   return { artista }
  // },
  data () {
    return {
      artista: null,
      uri: '',
      publicidade: null,
      cdAtual: null
    }
  },
  components: {
    HeaderArtista
  },
  created () {
    this.uri = this.$route.params.artista
    this.getArtista()
  },

  methods: {
    ouvir (id) {
      const cd = this.artista.cds.find(i => i.id === id)
      if (cd) {
        this.cdAtual = cd
        const musicas = cd.musicas

        if (Array.from(musicas).length > 0) {
          this.$store.commit('reproduzindo/limpar')

          const publicidade = this.$store.state.publicidade.list.filter(c => parseInt(cd.id) === parseInt(c.cd_id))
          if (Array.from(publicidade).length) {
            publicidade.forEach((p) => {
              this.$store.commit('reproduzindo/add', {
                id: p.id,
                cd_id: cd.id,
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
              capa: cd.capa_mini
            })
          }
          this.$nuxt.$emit('novareproducao', 0)
          this.contaPlayCd(id)
        }
      }
    },
    contaPlayCd (id) {
      this.$axios.get(`conta-play-cd/${id}`).then((r) => {
        const numPlays = r.data
        if (numPlays) {
          this.$store.commit('artista/setPlaysCd', { cd: this.cdAtual, numPlays })
        }
      }).catch(() => {
        console.log('erro')
      })
    },
    async getArtista () {
      const artista = await this.$store.state.artista.list.find(a => this.uri === a.url)
      if (artista) {
        this.artista = artista
      } else {
        const data = await this.$store.dispatch('artista/getArtista', { uri: this.uri })
        if (data.artista) {
          this.artista = data.artista
        }

        if (Array.from(data.publicidade).length > 0) {
          data.publicidade.forEach((p) => {
            this.$store.commit('publicidade/add', p)
          })
        }
      }
    },
    titulos (t) {
      if (t !== '') {
        return t.split(' ')
          .map(word => (word[0] ? word[0].toUpperCase() : '') + word.slice(1).toLowerCase())
          .join(' ')
      }
    },

    ativaBotaoPlay (id) {
      const botao = document.getElementById(`cd-${id}`)
      botao.style.display = 'block'
    },
    desativaBotaoPlay (id) {
      const botao = document.getElementById(`cd-${id}`)
      botao.style.display = 'none'
    }
  }
}
</script>

<style>
  .box-cd{
    border:none;
    position: relative;
  }
  .box-cd .card-text{
    padding:0;
    margin: 0;
    font-size: 12px;
    color:#999;
  }
  .box-cd .card-body{
    padding: 5px;
  }
  .box-cd .card-title{
    margin:0;
    padding: 0;
    font-size: 12px;
    font-weight: bold;
  }

  .botaoPlay{
    position:absolute;
    width: 40px;
    height: 40px;
    top:25%;
    left:38%;
    background: #00c5a2;
    border:none;
    border-radius: 50%;
    padding:0;
    z-index: 200;
    display: none;
  }

  .botaoPlay:hover{
    background: #0a967e;
  }
</style>

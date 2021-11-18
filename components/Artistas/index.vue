<template>
  <b-row>
    <b-col md="9">
      <b-overlay v-if="load || Array.from(artistas).length > 0 " :show="load" rounded="sm" style="min-height:200px">
        <b-row v-if="Array.from(artistas).length > 0">
          <b-col v-for="artista in artistas" :key="artista.id" md="3" v-once>
            <b-link :to="`/${artista.url}`" class="link-artista">
              <b-card
                :title="titulos(artista.name)"
                img-src=""
                img-alt=""
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2 box-artista-top"
              >
                <b-card-text>
                  <b-avatar :src="artista.foto" size="6rem" :alt="`Artista ${artista.nome}`"></b-avatar>
                </b-card-text>
              </b-card>
            </b-link>
          </b-col>
        </b-row>

        <div class="overflow-auto paginacao" v-if="artistas.length && rows > 1">
          <b-pagination-nav v-model="currentPage"  align="center" :link-gen="linkGen" :number-of-pages="rows" use-router />

          <p class="mt-3">Página: {{ currentPage }}</p>
        </div>
      </b-overlay>
    </b-col>

    <b-col md="3"></b-col>
  </b-row>
</template>

<script>
export default {
  data () {
    return {
      artistas: [],
      currentPage: 1,
      perPage: 1,
      rows: 1,
      load: false
    }
  },
  props: ['categoria', 'letra', 'tipo'],
  watch: {
    currentPage (val) {
      this.getArtistas()
    }
  },
  created () {
    this.getArtistas()
  },
  methods: {
    linkGen (pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    async getArtistas () {
      this.load = true
      this.scrollTop()
      await this.$axios.get(`${(this.letra ? `/artistas-letra/${this.letra.toLowerCase()}` : (this.tipo === 'artistas' ? 'artistas' : 'divulgadores'))}?page=${(this.$route.query.page ? this.$route.query.page : 1)}`, {
        params: {
          categoria: this.categoria
        }
      }).then((r) => {
        this.artistas = r.data.data
        this.currentPage = r.data.current_page
        this.perPage = r.data.per_page
        this.rows = r.data.last_page

        this.load = false
      }).catch((error) => {
        this.load = true
        console.log(error)
      })
    },
    titulos (t) {
      if (t !== '') {
        return t.split(' ')
          .map(word => (word[0] ? word[0].toUpperCase() : '') + word.slice(1).toLowerCase())
          .join(' ')
      }
    },
    scrollTop () {
      window.scroll({
        top: 'to',
        left: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style>
  .box-artista-top{
    text-align: center;
    border:none;
  }

  .link-artista {
    color: #333;
  }

  .link-artista:hover {
    text-decoration: none;
    color: #333;
  }

  .box-artista-top:hover{
    background: #f2f2f2;
  }

  .box-artista-top .card-title{
    font-size: 15px;
  }

  .paginacao{
    text-align: center;
  }
</style>

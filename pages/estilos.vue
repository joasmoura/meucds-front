<template>
  <b-container>
    <h1 class="pt-3 pb-3">Estilos</h1>

    <b-row>
      <b-col md="9">
        <b-row>
          <b-col v-for="categoria in categorias" :key="categoria.id" md="2" class="text-center">
            <b-link :to="`/categoria/${categoria.url}`" class="link-categoria">
              <b-card
                title=""
                img-src=""
                img-alt=""
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="mb-2 box-artista-top"
              >
                <b-card-text>
                  <b-img :src="categoria.img" width="40" />
                  <p class="nome">{{titulos(categoria.nome)}}</p>
                </b-card-text>
              </b-card>
            </b-link>
          </b-col>
        </b-row>
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      categorias: []
    }
  },
  created () {
    this.getCategorias()
  },
  methods: {
    getCategorias () {
      this.categorias = this.$store.state.categorias.list
      console.log(this.categorias)
    },
    titulos (t) {
      if (t !== '') {
        return t.split(' ')
          .map(word => (word[0] ? word[0].toUpperCase() : '') + word.slice(1).toLowerCase())
          .join(' ')
      }
    }
  }
}
</script>

<style>
  .link-categoria{
    text-decoration: none;
    color:#999;
    padding: 0;
  }

  .link-categoria:hover{
    text-decoration: none;
    color: #333;
  }

  .link-categoria .card{
    padding: 0;
  }

  .link-categoria .card:hover{
    background: #f2f2f2 !important;
  }

  .nome{
    font-size: 14px;
  }
</style>

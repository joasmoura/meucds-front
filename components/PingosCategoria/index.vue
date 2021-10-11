<template>
  <b-container v-if="categorias.length" class="py-3" fluid="lg">
      <b-nav pills align="center" class="categorias_amostra">
        <b-nav-item :to="(path === '/categoria/' ? '/' : path )" v-bind:active="$nuxt._route.path === path">Todos</b-nav-item>
        <b-nav-item v-for="categoria in categorias" :key="categoria.nome" v-show="categoria.mostra" v-bind:active="verificaAtivo(categoria)" :to="`${path}${categoria.url}`">{{ categoria.nome }}</b-nav-item>
        <b-nav-item id="popover-reactive-1">Mais</b-nav-item>
      </b-nav>

    <b-popover
      target="popover-reactive-1"
      triggers="click"
      :show.sync="popoverShow"
      placement="auto"
      container="my-container"
      ref="popover"
      @show="onShow"
      @shown="onShown"
      @hidden="onHidden"
    >
      <template #title>
        <b-button @click="onClose" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>
        Demais Categorias
      </template>

      <div>
        <b-nav vertical class="w-50">
          <div v-for="categoriaMenu in categorias" :key="categoriaMenu.id">
            <b-nav-item v-show="!categoriaMenu.mostra" v-bind:active="verificaAtivo(categoriaMenu)" :to="`${path}${categoriaMenu.url}`">{{categoriaMenu.nome}}</b-nav-item>
          </div>
        </b-nav>
      </div>
    </b-popover>
  </b-container>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      popoverShow: false,
      categorias: [],
      categoriasMenu: [],
      categoriasMostra: []
    }
  },
  props: ['path'],
  created () {
    this.montaCategorias()
  },
  methods: {
    montaCategorias () {
      const url = this.$nuxt._route.path
      this.$store.commit('categorias/sort', url)
      this.categorias = this.$store.state.categorias.list
    },
    verificaAtivo (categoria) {
      let active = false
      if (this.path + categoria.url === this.$nuxt._route.path) {
        active = true
        if (!categoria.mostra) {
          this.setMostra(categoria)
        }
      }
      return active
    },
    onShow () {

    },
    onShown () {
      // Called just after the popover has been shown
      // Transfer focus to the first input
      // this.focusRef(this.$refs.input1)
    },
    onHidden () {
      // Called just after the popover has finished hiding
      // Bring focus back to the button
      // this.focusRef(this.$refs.button)
    },
    onClose () {
      this.popoverShow = false
    },
    focusRef (ref) {
      this.$nextTick(() => {
        this.$nextTick(() => {
          ;(ref.$el || ref).focus()
        })
      })
    },
    ...mapMutations({
      ativa: 'categorias/ativa',
      setMostra: 'categorias/setMostra'
    })
  }
}
</script>

<style>
  .categorias_amostra .nav-link{
    background-color: #F6F6F6;
    color:#000000;
    margin-right: 10px;
    border-radius: 20px;
    padding-top:3px;
    padding-bottom:3px;
    font-size: 15px;
    border: 0.1px solid #ccc !important;
  }

  .categorias_amostra .active{
    border: 0.5px solid #000 !important;
    background: transparent !important;
    color:#000 !important;
  }
</style>

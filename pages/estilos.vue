<template>
  <b-container>
    Estilos

    <b-row>

      <b-col v-for="categoria in categorias" :key="categoria.id" md="3">
        {{categoria.nome}}
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
    }
  }
}
</script>

<style>

</style>

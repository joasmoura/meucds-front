<template>
  <b-container>
    <h1 class="titulo">Artistas top</h1>
    <pingos-categoria path="/artistas-top/" :categoria="categoria" />
    <artistas :categoria="categoria" />
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      categoria: this.$route.params.categoria
    }
  }
}
</script>

<style>

</style>

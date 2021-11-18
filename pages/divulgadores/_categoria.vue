<template>
  <b-container>
    <h1 class="titulo">Divulgadores</h1>
    <pingos-categoria path="/divulgadores/" :categoria="categoria" />
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

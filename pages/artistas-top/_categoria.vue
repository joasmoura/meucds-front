<template>
  <b-container>
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

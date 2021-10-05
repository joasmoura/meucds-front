<template>
  <h3>Albuns do Artista {{this.artista}}</h3>
</template>

<script>
export default {
  asyncData ({ params }) {
    const artista = params.artista

    return { artista }
  }
}
</script>

<style>

</style>

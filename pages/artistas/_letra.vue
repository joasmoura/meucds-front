<template>
  <b-container>
    Artist com a letra: {{letra}}
    <artistas :letra="letra"/>
  </b-container>
</template>

<script>
export default {
  data: () => ({
    letra: ''
  }),
  created () {
    const letra = this.$route.params.letra
    if (letra !== 'letra') {
      this.letra = letra
    }
  },
  getArtistas () {

  }
}
</script>

<style>

</style>

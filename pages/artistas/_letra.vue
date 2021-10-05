<template>
  <b-container>Letra: {{letra}}</b-container>
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
  }
}
</script>

<style>

</style>

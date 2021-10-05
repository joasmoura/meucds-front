<template>
  <b-container fluid>
    <pingos-categoria path="/categoria/" />
    <destaque-home :categoria="categoria" />
  </b-container>
</template>

<script>
import DestaqueHome from '@/components/DestaquesHome'
export default {
  data () {
    return {
      dcategoria: ''
    }
  },
  components: {
    DestaqueHome
  },
  created () {
    const categoria = this.$route.params.index
    this.categoria = categoria
  }
}
</script>

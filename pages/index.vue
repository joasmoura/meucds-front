<template>
  <div>
    <pingos-categoria path="/categoria/" />
    <destaque-home categoria="" />
  </div>
</template>

<script>
import DestaqueHome from '@/components/DestaquesHome'
import PingosCategoria from '@/components/PingosCategoria'
export default {

  components: {
    DestaqueHome, PingosCategoria
  },
  created () {
  }
}
</script>

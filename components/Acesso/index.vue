<template>
<b-container fluid class="">
  <b-row align-v="stretch">
      <b-col md="2"  class="bg-light">
          <Menu />
      </b-col>

      <b-col md="10">
        <banner />
        <slot />
      </b-col>
  </b-row>
</b-container>
</template>

<script>
import Menu from './Menu.vue'
import Banner from './Banner.vue'
export default {
  data () {
    return {
      cds: []
    }
  },
  components: { Menu, Banner },
  created () {
    this.getCds()
  },
  methods: {
    async getCds () {
      await this.$axios.get('usuario/cds').then((r) => {
        const cds = Array.from(r.data)
        if (cds) {
          this.cds = cds
        }
      }).catch((e) => {

      })
    }
  }

}
</script>

<style>

</style>

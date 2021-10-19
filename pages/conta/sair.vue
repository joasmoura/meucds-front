<template>
  <b-container>
      <h1>Deseja realmente sair?</h1>

      <div>
        <b-button @click="confirmar">Confirmar</b-button>
        <b-button to="/conta">Minha página</b-button>
      </div>
  </b-container>
</template>

<script>
export default {
  methods: {
    confirmar () {
      this.$auth.logout()
    }
  }
}
</script>

<style>

</style>

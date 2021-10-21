<template>
  <b-list-group>
    <b-list-group-item v-bind:active="$route.path === '/conta'">Meus cds</b-list-group-item>
    <b-list-group-item href="#" >Meus dados</b-list-group-item>
    <b-list-group-item href="#">Favoritos</b-list-group-item>
    <b-list-group-item href="#">Playlists</b-list-group-item>
    <b-list-group-item href="#" @click="sair">Sair</b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  methods: {
    sair () {
      this.$auth.logout()
    }
  }
}
</script>

<style>

</style>

<template>
  <div>
    <b-nav vertical>
      <b-nav-item v-bind:active="$route.path === '/conta'" to="/conta"><b-icon icon="disc" /> Mus cds</b-nav-item>
      <b-nav-item v-bind:active="$route.path === '/conta/meus-dados'" to="/conta/meus-dados"><b-icon icon="pencil-square" /> Meus dados</b-nav-item>
      <b-nav-item v-bind:active="$route.path === '/conta/favoritos'" to="/conta/favoritos"><b-icon icon="star" /> Favoritos</b-nav-item>
      <b-nav-item v-bind:active="$route.path === '/conta/playlists'" to="/conta/playlists"><b-icon icon="collection-play" /> Playlists</b-nav-item>
      <b-nav-item @click="sair"><b-icon icon="power" /> Sair</b-nav-item>
    </b-nav>
  </div>
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
  .nav-link{
    color: #333;
  }

  .nav-link:hover{
    color: #FF416C;
  }

  .active{
    color: #FF416C;
  }
</style>

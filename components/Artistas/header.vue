<template>
  <div>
    <b-container fluid class="banner-artista"></b-container>
    <b-container class="infos-artista p-5 d-md-flex flex-row justify-content-between">
      <div class="d-md-flex flex-row justify-content-between align-content-center align-items-center">
        <b-skeleton v-if="!Object.entries(artista).length" type="avatar"></b-skeleton>
        <b-avatar v-if="Object.entries(artista).length > 0" :src="artista.foto" size="6rem" :alt="`Artista ${artista.nome}`"></b-avatar>

        <div class="ml-3">
          <h1 class="nome-artista">{{artista.nome}}</h1>
        </div>
      </div>

      <div class="d-md-flex flex-row ju.lenstify-content-between align-content-center align-items-center">
        <div class="pr-3">
          <h4 class="num-dado">1000</h4>
          <span class="nome-dado">Reproduções</span>
        </div>

        <div>
          <h4 class="num-dado">1000</h4>
          <span class="nome-dado">Downloads</span>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  props: ['artista']
}
</script>

<style>

</style>

<template>
  <div>
    <b-container fluid class="banner-artista p-0">
        <b-img v-if="artista && artista.banner" :src="(artista && artista.banner ? artista.banner : '')"/>
      <!-- <b-container class="banner-artista-banner p-0">
      </b-container> -->
    </b-container>

    <b-container class="infos-artista p-5 d-md-flex flex-row justify-content-between">
      <div class="d-md-flex flex-row justify-content-between align-content-center align-items-center">
        <b-skeleton v-if="!artista" type="avatar"></b-skeleton>
        <b-avatar v-if="cd" :src="cd.capa_mini" size="6rem" :alt="`Artista ${cd.titulo}`"></b-avatar>
        <b-avatar v-else :src="(artista ? artista.foto : '')" size="6rem" :alt="`Artista ${(artista ? artista.name : '')}`"></b-avatar>

        <div class="ml-3">
          <h5 v-if="cd" style="font-weight: bold !important"><b-link :to="`/${artista.url}/${cd.url}`"><b-icon v-if="$route.params.musica" icon="arrow-return-left" font-scale="0.7" /> CD {{cd.titulo}}</b-link></h5>
          <h1 class="nome-artista"><b-link :to="`/${(artista ? artista.url : '')}`"><b-icon v-if="$route.params.cd" icon="arrow-return-left" font-scale="0.7" /> {{(artista ? artista.name : '')}}</b-link></h1>
          <b-button v-if="cd" size="sm" @click="$emit('ouvirCd')"><b-icon icon="play-fill" /> Reproduzir</b-button>
          <b-overlay
            :show="baixando"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button v-if="cd" size="sm" @click="$emit('baixarCd')"><b-icon icon="cloud-download" /> Baixar cd</b-button>
          </b-overlay>
        </div>
      </div>

      <div class="d-md-flex flex-row ju.lenstify-content-between align-content-center align-items-center">
        <div class="pr-3">
          <h4 class="num-dado">{{contarPlays()}}</h4>
          <span class="nome-dado">Reproduções</span>
        </div>

        <div>
          <h4 class="num-dado">{{contarDownloads()}}</h4>
          <span class="nome-dado">Downloads</span>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  props: ['artista', 'cd', 'baixando'],
  methods: {
    contarDownloads () {
      let num = 0
      if (this.cd) {
        return this.cd.num_downloads
      } else if ((this.artista !== null &&
        this.artista !== 'undefined') &&
        this.artista.cds && Array.from(this.artista.cds).length) {
        this.artista.cds.forEach((a) => {
          num += parseInt(a.num_downloads)
        })
      }
      return num
    },
    contarPlays () {
      let num = 0
      if (this.cd) {
        return this.cd.num_plays
      } else if ((this.artista !== null &&
       this.artista !== 'undefined') && this.artista.cds &&
       Array.from(this.artista.cds).length) {
        this.artista.cds.forEach((a) => {
          num += parseInt(a.num_plays)
        })
      }
      return num
    }
  }
}
</script>

<style>
  .banner-artista{
    min-height: 100px;
    max-height: 240px;
    background: orange;
    text-align: center;
    z-index: -1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
  .banner-artista img{
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .infos-artista{
    position: relative;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 .5em #ccc;
    z-index: 200;
  }

  .infos-artista .nome-artista{
    font-size: 1.3em;
  }

  .infos-artista .num-dado{
    font-weight: bold;
    color: #00C5A2;
    font-size: 20px;
    margin: 0;
  }

  .infos-artista .nome-dado{
    font-size: 15px;
    color: #00C5A2;
  }

  @media (min-width: 600px) {
    .infos-artista{
      margin-top: -20px !important;
    }
  }

</style>

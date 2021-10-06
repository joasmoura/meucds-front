<template>
  <section class="d-block">
    <b-container fluid="sm">
      <loader :load="load" />
      <b-link v-if="Object.entries(banner1).length > 0 " :to="`/${banner1.url}`">
        <b-card
          overlay
          :img-src="banner1.imagem"
          img-alt=""
          text-variant="white"
          :title="banner1.nome"
          sub-title=""
          class="banner_destaque"
        >
          <b-card-text><b-link :to="banner1.link" class="button-banner1">OUÇA O SOM DESTE ARTISTA</b-link></b-card-text>
        </b-card>
      </b-link>

      <b-row v-if="banner2" class="py-2">
        <b-col md="4" v-if="load">
          <loader :load="load" />
        </b-col>

        <b-col md="4" sm="3">
          <b-link :to="`/${banner2.url}`">
            <b-card
              overlay
              :img-src="banner2.imagem"
              img-alt=""
              text-variant="white"
              :title="banner2.nome"
              sub-title=""
              class="banner_mini"
            >
              <b-card-text></b-card-text>
            </b-card>
          </b-link>
        </b-col>

        <b-col md="4" v-if="banner3">
          <b-link :to="`/${banner3.url}`">
            <b-card
              overlay
              :img-src="banner3.imagem"
              img-alt=""
              text-variant="white"
              :title="banner3.nome"
              sub-title=""
              class="banner_mini"
            >
              <b-card-text></b-card-text>
            </b-card>
          </b-link>
        </b-col>

        <b-col v-if="banner4" md="4">
          <b-link :to="`/${banner4.url}`">
            <b-card
              overlay
              :img-src="banner4.imagem"
              img-alt=""
              text-variant="white"
              :title="banner4.nome"
              sub-title=""
              class="banner_mini"
            >
              <b-card-text></b-card-text>
            </b-card>
          </b-link>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
export default {
  data () {
    return {
      load: false,
      banner1: [],
      banner2: [],
      banner3: [],
      banner4: []
    }
  },
  props: ['categoria'],
  created () {
    this.getBanners()
  },
  methods: {
    async getBanners () {
      const banner = this.$store.state.banner.list.filter(c => (this.categoria ? c.url_categoria === this.categoria : c.categoria_id === null))

      if (banner.length > 0) {
        this.montarBanner(banner)
      } else {
        this.load = true
        await this.$axios.get('banners', {
          params: {
            categoria: this.categoria
          }
        }).then((r) => {
          const banners = r.data

          if (banners) {
            this.montarBanner(banners)
            const banner1 = banners.find(b => parseInt(b.ordem) === 1)
            const banner2 = banners.find(b => parseInt(b.ordem) === 2)
            const banner3 = banners.find(b => parseInt(b.ordem) === 3)
            const banner4 = banners.find(b => parseInt(b.ordem) === 4)

            if (banner1) { this.$store.commit('banner/add', banner1) }
            if (banner2) { this.$store.commit('banner/add', banner2) }
            if (banner3) { this.$store.commit('banner/add', banner3) }
            if (banner4) { this.$store.commit('banner/add', banner4) }

            console.log(banner1)
          }
          this.load = false
        })
      }
    },
    montarBanner (banner) {
      const banner1 = banner.find(b => parseInt(b.ordem) === 1)
      const banner2 = banner.find(b => parseInt(b.ordem) === 2)
      const banner3 = banner.find(b => parseInt(b.ordem) === 3)
      const banner4 = banner.find(b => parseInt(b.ordem) === 4)

      if (banner1) { this.banner1 = banner1 }
      if (banner2) { this.banner2 = banner2 }
      if (banner3) { this.banner3 = banner3 }
      if (banner4) { this.banner4 = banner4 }
    }
  },
  asyncData ({ params }) {
  }
}
</script>

<style>
  .banner_destaque, .banner_mini{
    border: none !important;
    position:relative;
  }

  .banner_destaque::after, .banner_mini::after{
    content: "";
    background: radial-gradient(circle at -50% 10%,rgba(0,0,0,.5) 50%,rgba(0,0,0,0) 90%);
    width:60%;
    height: 100%;
    position:absolute;
    display: block;
  }

  .banner_destaque .card-title, .banner_mini .card-title{
    font-weight: bold;
    margin-top: 20px;
    position: absolute;
    z-index: 123;
  }

  .banner_mini .card-title{
    font-weight: 600 !important;
    font-size: 18px;
    width:55%;
  }

  .banner_destaque img{
    height: 250px;
    border-radius: 10px;
  }

  .banner_destaque .button-banner1{
    background-image: linear-gradient(to bottom, rgba(18, 201, 169, 1), rgba(0, 197,162,1));
    padding: 5px 30px;
    border-radius: 20px;
    color: #FFF;
    font-size: 13px;
    position: absolute;
    left: 35%;
    bottom: 20px;
    text-decoration: none;
    z-index: 1000;
  }

  .banner_destaque .button-banner1:hover{
    background: #00C5A2;
  }

  .banner_mini{
    border: none !important;
  }

  .banner_mini img{
    height: 130px;
  }

  @media screen and (max-width: 480px) {
    .bannerDestaque {
      height: 120px;
    }
  }
</style>

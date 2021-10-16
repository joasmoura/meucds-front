<template>
<div>
  <b-navbar toggleable="lg" type="light" variant="light" class="navbar-topo">
    <b-container fluid="sm">
      <b-navbar-brand to="/" title="Págiina inicial do Meu Cds">
        <b-img :src="require('../static/meucds-logomarca.png')" width="150px" alt="Logo Meu Cds"></b-img>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2 input-busca" placeholder="Faça uma busca"></b-form-input>
          </b-nav-form>

          <!-- <b-nav-item to="/musicas-top" class="link-nav-topo" title="Músicas Top">Músicas</b-nav-item> -->
          <b-nav-item to="/artistas-top" class="link-nav-topo" title="Artistas">Artistas</b-nav-item>
          <b-nav-item to="/login" class="link-nav-topo" title="Acessar painel do usuário">Entrar</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item size="sm" class="btn btn-sm btn-success botao-up px-5 py-0" to="/login" >Upload</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>

  <player />
  <Nuxt />
  <footer class="d-block">
    <b-container fluid class="p-0 bg-light">
      <b-container fluid="sm">
        <div class="d-flex justify-content-between py-1 lista-alfabeto flex-wrap">
          <b-link to="/artistas/A">A</b-link>
          <b-link to="/artistas/B">B</b-link>
          <b-link to="/artistas/C">C</b-link>
          <b-link to="/artistas/D">D</b-link>
          <b-link to="/artistas/E">E</b-link>
          <b-link to="/artistas/F">F</b-link>
          <b-link to="/artistas/G">G</b-link>
          <b-link to="/artistas/H">H</b-link>
          <b-link to="/artistas/I">I</b-link>
          <b-link to="/artistas/J">J</b-link>
          <b-link to="/artistas/K">K</b-link>
          <b-link to="/artistas/L">L</b-link>
          <b-link to="/artistas/M">M</b-link>
          <b-link to="/artistas/N">N</b-link>
          <b-link to="/artistas/O">O</b-link>
          <b-link to="/artistas/P">P</b-link>
          <b-link to="/artistas/Q">Q</b-link>
          <b-link to="/artistas/R">R</b-link>
          <b-link to="/artistas/S">S</b-link>
          <b-link to="/artistas/T">T</b-link>
          <b-link to="/artistas/U">U</b-link>
          <b-link to="/artistas/V">V</b-link>
          <b-link to="/artistas/W">W</b-link>
          <b-link to="/artistas/X">X</b-link>
          <b-link to="/artistas/Y">Y</b-link>
          <b-link to="/artistas/Z">Z</b-link>
          <b-link to="/artistas/1">1/9</b-link>
        </div>
      </b-container>

      <hr class="m-0">

      <b-container class="py-5 links-rodape" fluid="sm">
        <b-row>
          <b-col>
            <strong>Músicas</strong>
            <!-- <b-link to="/musicas-top" class="mt-2 d-block" title="Músicas Top">Músicas Top</b-link> -->
            <b-link to="/clipes-top" class="mt-2 d-block" title="Clientes Top">Clipes Top</b-link>
            <b-link to="/estilos" class="mt-2 d-block" title="Estilos Musicais">Estilos</b-link>
          </b-col>

          <b-col>
            <strong>Artistas</strong>
            <b-link to="/artistas-top" class="mt-2 d-block" title="Artistas Top">Tops</b-link>
            <b-link to="#foo" class="mt-2 d-block" title="Destaques de Artistas">Destaques</b-link>
          </b-col>

          <b-col>
            <strong>Sobre</strong>
            <b-link to="/anuncie" class="mt-2 d-block" title="Anuncie aqui">Anuncie</b-link>
            <b-link to="/sobre" class="mt-2 d-block" title="Sobre Meucds">Sobre</b-link>
            <b-link to="/termos-de-uso" class="mt-2 d-block" title="Termos de Uso Meu Cds">Termos</b-link>
            <b-link to="/politicas-de-privacidade" class="mt-2 d-block" title="Políticas de Privacidade Meu Cds">Políticas</b-link>
          </b-col>

          <b-col>
            <b-link to="#foo" class="btn botao-up btn-divulgue px-5" title="Divulgue aqui">DIVULGUE</b-link>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </footer>
</div>
</template>

<script>
import Player from '@/components/Player'
export default {
  data () {
    return {
    }
  },
  created () {
    this.getCategorias()
    this.musicasPadrao()
  },
  components: {
    Player
  },
  scrollToTop: true,
  methods: {
    async getCategorias () {
      const url = this.$nuxt._route.path

      await this.$axios.get('categorias').then((r) => {
        const categorias = r.data
        if (categorias) {
          categorias.map((c, i) => {
            this.$store.commit('categorias/add', {
              nome: c.nome,
              url: c.url,
              mostra: (i <= 4),
              active: (url === '/categoria' + c.url || url === '/artistas-top' + c.url),
              img: c.img
            })

            return c
          })
        }
      })
    },
    musicasPadrao () {
      const musicas = this.$store.state.reproduzindo.list

      if (!musicas.length) {
        const sources = [
          {
            src: 'http://localhost/meucds/storage/musicas/FARRA%20DE%20QUALIDADE/01%20VAPO%20CHAPULETEI.mp3',
            type: 'audio/mp3',
            nome: 'Meu parceiro'
          },
          {
            src: 'https://www.meucds.com/musicas/TAYRONE%20AGOSTO%202020/1-EDILENE%20(IN%C3%89DITA).mp3',
            type: 'audio/mp3',
            nome: 'Edilene'
          }
        ]

        sources.forEach((s) => {
          this.$store.commit('reproduzindo/add', s)
        })
      }
    }

  }
}
</script>

<style>
  .navbar-topo{
    background: #252323 !important;
    padding: 4px;
  }

  .input-busca{width: 500px !important; border-radius:5px;}
  .botao-up{background: #00C5A2; border:none; border-radius:20px;}
  .botao-up:hover{background: #02AE8F; }
  .botao-up a{color:#FFF !important;}

  .btn-divulgue{color:#FFF !important;}

  .link-nav-topo a{
    color:#fff !important;
    font-weight: 600;
    font-size: 14px;
  }

  .links-rodape a {
    color: #7D7D7D;
    text-decoration: none;
  }
  .links-rodape a:hover {
    color:#242222;
  }

  .lista-alfabeto a {
    color: #7D7D7D;
    text-decoration: none;
    font-weight: bold;
    font-size:12px;
    padding:10px;
  }

  .lista-alfabeto a:hover {
    color:#242222;
  }

  @media screen and (max-width: 480px) {
    .input-busca{width: 300px !important;}
  }
</style>

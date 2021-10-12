<template>
<div>
  <b-list-group>
    <b-list-group-item v-for="(musica, key) in musicas" :key="musica.id" @mouseenter="ativaBotaoPlay(key)" @mouseleave="desativaBotaoPlay(key)" class="musica d-md-flex flex-row justify-content-between  align-items-center">
      <div>
        <span class="p-4">{{renderNumero(key)}}</span>

        <b-button :id="`musica-${key}`" class="botaoPlay" @click="ouvir(key)" v-b-tooltip.hover :title="`Escutar ${titulos(musica.nome)}`">
          <b-icon icon="play-fill" />
        </b-button>
      </div>

      <b-link :to="`${uri}/${musica.url}`" class="d-block w-100 text-center nome" size="sm">
        {{titulos(musica.nome)}}
      </b-link>

      <div>
        <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
           <b-icon icon="three-dots-vertical"/>
          </template>

          <b-dropdown-item :href="`${musica.link_musica}`">Baixar</b-dropdown-item>
        </b-dropdown>
      </div>
    </b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
export default {
  data () {
    return {
      uri: '',
      hoverList: '',
      mumero: 0
    }
  },
  props: ['musicas', 'origem'],
  created () {
    this.uri = this.$route.params.artista
  },
  computed: {

  },
  methods: {
    renderNumero (key) {
      return parseInt(key) + 1
    },
    ativaBotaoPlay (id) {
      const botao = document.getElementById(`musica-${id}`)
      botao.style.display = 'block'
    },
    desativaBotaoPlay (id) {
      const botao = document.getElementById(`musica-${id}`)
      botao.style.display = 'none'
    },
    ouvir (key) {
      this.$store.commit('reproduzindo/limpar')

      if (this.origem === 'todas') {
        this.musicas.forEach((s) => {
          this.$store.commit('reproduzindo/add', {
            id: s.id,
            cd_id: s.cd_id,
            src: s.link_musica,
            type: 'audio/mp3',
            nome: s.nome
          })
        })
      } else if (this.origem === 'cd') {
        for (const key in this.musicas) {
          this.$store.commit('reproduzindo/add', {
            id: this.musicas[key].id,
            cd_id: this.musicas[key].cd_id,
            src: this.musicas[key].link_musica,
            type: 'audio/mp3',
            nome: this.musicas[key].nome
          })
        }
      }
      this.$nuxt.$emit('novareproducao', key)

      const publicidade = this.$store.state.publicidade.list.filter(c => parseInt(this.musicas[0].cd_id) === parseInt(c.cd_id))
      if (publicidade.length) {
        publicidade.forEach((p) => {
          this.$store.commit('reproduzindo/add', {
            id: p.id,
            cd_id: p.cd_id,
            src: p.src,
            type: p.origem,
            nome: p.titulo,
            link: p.link
          })
        })
      }
    },
    titulos (t) {
      if (t !== '') {
        return t.split(' ')
          .map(word => (word[0] ? word[0].toUpperCase() : '') + word.slice(1).toLowerCase())
          .join(' ')
      }
    }
  }
}
</script>

<style>
  .nome{
    color: #555;
  }

  .nome:hover{
    color: #00c5a2;
    text-decoration: none;
  }

  .musica{
    border:none;
    border-bottom: 0.3px solid #f2f2f2;
  }
  .musica:hover{
    background: #f2f2f2;
    cursor: pointer;
  }

  .botaoPlay{
    display: none;
    position:absolute;
    top:15px;
    left:30px;
    background: #00c5a2;
    border:none;
    border-radius: 50%;
    padding:0;
    width: 40px;
    height: 40px;
  }

  .botaoPlay:hover{
    background: #12C9A9;
  }
</style>

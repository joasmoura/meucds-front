<template>
<div>
  <h1>Musicas</h1>
  <b-list-group>
    <b-list-group-item v-for="(musica, key) in musicas" :key="musica.id" @mouseenter="ativaBotaoPlay(key)" @mouseleave="desativaBotaoPlay(key)" class="musica d-md-flex flex-row justify-content-between  align-items-center">
      <div>
        <span v-if="(key+1 < 10 ? '0' : '')" class="p-4">0{{key+1}}</span>
        <span v-else class="p-4">{{key+1}}</span>

        <b-button :id="`musica-${key}`" class="botaoPlay" @click="ouvir(musica.id)" v-b-tooltip.hover :title="`Escutar ${titulos(musica.nome)}`">
          <b-icon icon="play-fill"></b-icon>
        </b-button>
      </div>

      <b-link :to="`${uri}/${musica.url}`" class="d-block w-100 text-center nome" size="sm">
        {{titulos(musica.nome)}}
      </b-link>

      <div>
        <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
           <b-icon icon="three-dots-vertical"></b-icon>
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
      hoverList: ''
    }
  },
  props: ['musicas', 'origem'],
  created () {
    this.uri = this.$route.params.artista
  },
  methods: {
    ativaBotaoPlay (id) {
      const botao = document.getElementById(`musica-${id}`)
      botao.style.display = 'block'
    },
    desativaBotaoPlay (id) {
      const botao = document.getElementById(`musica-${id}`)
      botao.style.display = 'none'
    },
    ouvir (id) {
      if (this.origem === 'todas') {
        this.$store.commit('reproduzindo/limpar')
        this.musicas.forEach((s) => {
          this.$store.commit('reproduzindo/add', {
            id: s.id,
            src: s.link_musica,
            type: 'audio/mp3',
            nome: s.nome
          })
        })
        const reproduzindo = this.$store.state.reproduzindo.list.find(it => parseInt(it.id) === id)
        this.$store.commit('reproduzindo/addCurrent', {
          id: reproduzindo.id,
          src: reproduzindo.src,
          type: 'audio/mp3',
          nome: reproduzindo.nome
        })
        this.$nuxt.$emit('novareproducao')
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

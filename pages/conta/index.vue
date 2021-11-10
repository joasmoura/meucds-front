<template>
<Acesso>
  <div class="d-flex flex-row justify-items-center">
    <h3>Cds</h3>
    <b-button variant="link" class="ml-3" size="sm" to="/conta/cd/form"><b-icon icon="plus" /> cd</b-button>
  </div>

  <b-row>
    <b-col v-for="cd in cds" :key="cd.id" xs="12" md="3" sm="6">
        <b-card
          :title="cd.artista"
          :img-src="cd.capa_mini"
          img-alt=""
          img-top
          tag="article"
          style=""
          class="mb-2 item"
        >
          <span>{{cd.titulo}}</span>
          <b-card-text class="d-flex p-0 m-0 mt-3">
            <b-button :to="`conta/cd/${cd.id}`" size="sm" variant="primary" class="mr-2 w-50" title="Editar CD"><b-icon icon="pencil-square"/></b-button>
            <b-button @click="remover(cd.id)" size="sm" variant="danger" class="w-50" title="Remover CD"><b-icon icon="trash"/></b-button>
          </b-card-text>
        </b-card>
    </b-col>
  </b-row>
</Acesso>
</template>

<script>
import Swal from 'sweetalert2'
import Acesso from '@/components/Acesso'

export default {
  middleware: 'auth',
  components: { Acesso },
  data () {
    return {
      cds: []
    }
  },
  created () {
    this.getCds()
  },
  methods: {
    async getCds () {
      await this.$axios.get('/cds').then((r) => {
        const cds = r.data
        if (cds) {
          this.cds = cds.data
        }
      })
    },

    remover (id) {
      Swal.fire({
        title: '',
        text: 'Deseja realmente remover esse cd?',
        icon: 'question',
        showCancelButton: true
      }).then((e) => {
        if (e.isConfirmed) {
          this.$axios.delete(`cds/${id}`).then((r) => {
            if (r.data) {
              Swal.fire({
                title: 'Cd excluído com sucesso!',
                text: '',
                icon: 'success',
                timer: 1500
              }).then(() => {
                this.getCds()
              })
            }
          })
        }
      })
    }
  }

}
</script>

<style>
  .item{
    scale: 0.9;
    transition: scale 0.3s;
  }

  .item:hover{
    scale: 1;
  }

  .item .card-title{
    font-size: 15px;
    padding:0;
  }

  .item .card-body{
    padding:5px;
  }
</style>

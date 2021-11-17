<template>
<Acesso>
  <div class="d-flex flex-row justify-content-between justify-items-center">
    <h3>Meus cds cadastrados</h3>
    <b-button variant="primary" size="sm" to="/conta/cd/form"><b-icon icon="plus" /> cadastro</b-button>
  </div>

  <b-row class="my-3">
    <b-col v-if="loading" md="12">
      <b-skeleton-wrapper :loading="loading">
        <template #loading>
          <b-card>
            <b-skeleton width="85%"></b-skeleton>
            <b-skeleton width="55%"></b-skeleton>
            <b-skeleton width="70%"></b-skeleton>
          </b-card>
        </template>
      </b-skeleton-wrapper>
    </b-col>

      <b-col v-for="cd in cds" :key="cd.id" xs="12" md="3" sm="6">
          <b-card
            :title="`${cd.artista}: ${cd.titulo}`"
            :img-src="(cd.capa_mini ? cd.capa_mini : '/capa-cd.jpg')"
            img-alt=""
            img-top
            tag="article"
            style=""
            class="mb-2 item"
          >
            <b-card-text class="p-0 m-0 mt-3">
              <div class="d-flex justify-content-between">
                <span>{{cd.num_download}} Downloads</span>
                <span>{{cd.num_play}} Plays</span>
              </div>

              <div class="d-flex">
                <b-button :to="`conta/cd/${cd.id}`" size="sm" variant="primary" class="mr-2 w-50" title="Editar CD"><b-icon icon="pencil-square"/></b-button>
                <b-button @click="remover(cd.id)" size="sm" variant="danger" class="w-50" title="Remover CD"><b-icon icon="trash"/></b-button>
              </div>
            </b-card-text>

            <template #footer>
              <small class="text-muted">Cadastro em: {{cd.data_cadastro}}</small>
            </template>
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
      cds: [],
      loading: true
    }
  },
  created () {
    this.getCds()
  },
  methods: {
    async getCds () {
      await this.$axios.get('/cds').then((r) => {
        const cds = r.data
        if (Array.from(cds.data).length) {
          this.cds = cds.data
        } else {
          this.cds = []
        }
        this.loading = false
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

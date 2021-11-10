<template>
<Acesso>
  <h3>Meus dados</h3>
  <b-form @submit.prevent="salvar">
    <b-row>
      <b-col md="6">
        <b-form-group label="Nome *" label-for="input-nome" >
          <b-form-input id="input-nome" v-model="name" type="text" placeholder="Digite seu nome" required />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="URL" label-for="input-url" >
          <b-form-input id="input-url" v-model="url" type="email" placeholder="Digite sua url" />
        </b-form-group>
      </b-col>

      <b-col md="12"></b-col>

      <b-col md="6">
        <b-form-group label="Celular *" label-for="input-tel" >
          <b-form-input id="input-tel" v-model="telefone_usuario" type="text" placeholder="Digite seu celular" required />
        </b-form-group>
      </b-col>

      <b-col md="12"></b-col>

      <b-col md="12">
        <b-form-group label="Sobre" label-for="input-sobre" >
          <b-form-textarea
            id="input-sobre"
            v-model="sobre_usuario"
            placeholder="Sobre"
            rows="3"
          ></b-form-textarea>
        </b-form-group>
      </b-col>

      <b-col md="12">Dados de acesso</b-col>

      <b-col md="6">
        <b-form-group label="Email *" label-for="input-email" >
          <b-form-input id="input-email" v-model="email" type="email" placeholder="Digite seu email" required />
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Senha" label-for="input-senha" >
          <b-form-input id="input-senha" v-model="password" type="password" placeholder="Digite sua senha" />
        </b-form-group>
      </b-col>

      <b-col md="12" class="my-3 py-3">
        <b-button type="submit" variant="success"><b-icon icon="check-all" /> Salvar</b-button>
      </b-col>

    </b-row>
  </b-form>
</Acesso>
</template>

<script>
import Swal from 'sweetalert2'
import Acesso from '@/components/Acesso'
export default {
  middleware: 'auth',
  data () {
    return {
      name: this.$auth.user.name,
      url: this.$auth.user.url,
      email: this.$auth.user.email,
      password: '',
      telefone_usuario: this.$auth.user.telefone_usuario,
      sobre_usuario: this.$auth.user.sobre_usuario,
      salvando: false
    }
  },
  components: { Acesso },
  methods: {
    async salvar () {
      let dados = null
      if (this.password) {
        dados = {
          id: this.$auth.user.id,
          name: this.name,
          email: this.email,
          url: this.url,
          password: this.password,
          telefone_usuario: this.telefone_usuario,
          sobre_usuario: this.sobre_usuario
        }
      } else {
        dados = {
          id: this.$auth.user.id,
          name: this.name,
          email: this.email,
          url: this.url,
          telefone_usuario: this.telefone_usuario,
          sobre_usuario: this.sobre_usuario
        }
      }

      await this.$axios.post('usuario-update', dados).then((r) => {
        if (r.data.status) {
          Swal.fire({
            title: 'Sucesso',
            text: 'Seus dados foram atualizados!',
            icon: 'success',
            timer: 1500
          })
        }
      }).catch((e) => {
        const erros = e.response.data
        if (erros) {
          for (const erro in erros.errors) {
            this.alertaErro(erros.errors[erro][0])
          }
        }
      })
    },
    alertaErro (erro) {
      Swal.fire({
        title: 'Erro',
        text: erro,
        icon: 'error'
      })
    }
  }
}
</script>

<style>

</style>

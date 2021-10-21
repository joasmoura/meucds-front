<template>
<login titulo="DIGITE A NOVA SENHA">
  <template v-slot:form1>
  </template>

  <template v-slot:form2>
    <form @submit.prevent="alterarSenha">
      <h1>Nova senha</h1>
      <input type="password" v-model="password" class="form-control" placeholder="Senha">
      <input type="password" v-model="password_confirmation" class="form-control" placeholder="Confirmar Senha">
      <b-button type="submit">Confirmar</b-button>
    </form>
  </template>

  <template v-slot:left>
  </template>

  <template v-slot:right>
    <h1>Meu Cds</h1>
    <p>Estamos prontos para alterar sua senha</p>
  </template>

</login>
</template>

<script>
import Swal from 'sweetalert2'
import Login from '../../components/Acesso/Login.vue'
export default {
  components: { Login },
  data () {
    return {
      passwordReset: null,
      password: '',
      password_confirmation: ''
    }
  },
  created () {
    this.verificaToken()
  },
  methods: {
    async alterarSenha () {
      await this.$axios.post('confirmar-alteracao-senha', {
        password: this.password,
        password_confirmation: this.password_confirmation,
        email: this.passwordReset.email,
        token: this.passwordReset.token
      }).then((r) => {
        if (r.data.status) {
          Swal.fire({
            title: 'Sucesso',
            text: 'Sua senha foi alterada comsucesso! Agpora faça login!',
            icon: 'success',
            timer: 2000
          }).then(() => {
            this.$router.push('/login')
          })
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    async verificaToken () {
      const token = this.$route.params.recuperar
      if (token) {
        await this.$axios.post('verifica-token-recupera-senha', {
          token
        }).then((r) => {
          if (r.data) {
            this.passwordReset = r.data.reset
          }
        }).catch((e) => {
          console.log(e)
          this.$router.push('/login')
        })
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style>

</style>

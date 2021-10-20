<template>
<b-container>
  <h1>recuperar Senha</h1>
  <input type="password" v-model="password" class="form-control" placeholder="Senha">
  <input type="password" v-model="password_confirmation" class="form-control" placeholder="Confirmar Senha">
  <b-button @click="alterarSenha">Confirmar</b-button>
</b-container>
</template>

<script>
export default {
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
          alert('Sua senha foi alterada comsucesso! Agpora faça login!')
          this.$router.push('/login')
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

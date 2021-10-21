<template>
  <login titulo="ACESSE OU CADASTRE-SE, É TOTALMENTE GRÁTIS">
    <template v-slot:form1>
      <form @submit.prevent="registrar" enctype="multipart/form-data">
          <h1>Criar Conta</h1>

          <div class="social-container">
            <a href="#" class="social"><b-icon icon="facebook" /></a>
            <a href="#" class="social"><b-icon icon="google" /></a>
          </div>

          <span>Escolha uma foto de perfil</span>
          <input type="file" @change="changeFoto" name="foto_usuario" accept="image/*" defaultValue="Insira a foto padrão">
          <input type="text" v-model="name" placeholder="Nome" />
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Senha" />
          <b-button type="submit">Cadastre - se</b-button>
        </form>

         <b-modal v-model="modalRecuperarSenha" centered title="Recuperar Senha" hide-footer>
          <input type="email" v-model="email" placeholder="Email" class="form-control"/>

          <div class="d-flex flex-row justify-content-between my-3">
            <div><b-button variant="success" @click="recuperar">Confirmar</b-button></div>
            <div><b-button variant="danger" @click="modalRecuperarSenha = false">Cancelar</b-button></div>
          </div>
        </b-modal>
    </template>

    <template v-slot:form2>
      <form @submit.prevent="login">
        <h1>Entrar</h1>
        <div class="social-container">
          <a href="#" class="social"><b-icon icon="facebook" /></a>
          <a href="#" class="social"><b-icon icon="google" /></a>
        </div>
        <span>Ou use sua conta</span>
        <input type="email" v-model="email" placeholder="Email" />
        <input type="password" v-model="password" placeholder="senha" />
        <a href="javascript: void(0)" @click="modalRecuperarSenha = true">Esqueceu sua senha?</a>
        <b-button type="submit">Entrar</b-button>
      </form>
    </template>

    <template v-slot:left>
      <h1>Bem vindo de volta!</h1>
      <p>Para se manter conectado conosco, faça o login com suas informações pessoais</p>
      <b-button class="ghost" id="signIn" @click="$emit('containerRemove')">Entrar</b-button>
    </template>

    <template v-slot:right>
      <h1>Meu Cds</h1>
      <p>Insira seus dados pessoais e faça parte de nosso time</p>
      <b-button class="ghost" id="signUp" @click="$emit('containerAdd')">Cadastre - se</b-button>
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
      name: '',
      email: '',
      password: '',
      foto: null,
      modalRecuperarSenha: false
    }
  },
  created () {

  },
  methods: {
    async registrar () {
      const form = new FormData()
      form.append('name', this.name)
      form.append('email', this.email)
      form.append('password', this.password)
      if (this.foto) {
        form.append('foto', this.foto)
      }

      await this.$axios.post('/registrar', form).then((r) => {
        if (r.data.status) {
          if (r.data.user) {
            this.$auth.setUser(r.data.user)
            this.$auth.setUserToken(r.data.authenticationToken)
            this.$router.push('/conta')
          } else {
            this.$router.push('/login')
          }
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Alco deu errado ao cadastrar!',
            icon: 'warning',
            timer: 2000
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
    },
    async login () {
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      }).then(() => {
        console.log('Sucesso')
      }).catch((e) => {
        const erros = e.response.data
        if (erros.errors) {
          for (const erro in erros.errors) {
            this.alertaErro(erros.errors[erro][0])
          }
        } else {
          this.alertaErro('Não foi possível efetuar o login, verifique se seu email e senha estão corretos ou entre em contato conosco!')
        }
      })
    },
    async recuperar () {
      await this.$axios.post('recuperar-senha', {
        email: this.email
      }).then((r) => {
        if (r.data.status) {
          Swal.fire({
            title: 'Sucesso',
            text: 'Enviaremos para sua caixa de email as instruções para recuperar sua senha!',
            icon: 'success'
          })
        } else {
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível encontrar sua conta! Verifique se seu email está correto!!',
            icon: 'error'
          })
        }
      })
    },

    changeFoto (event) {
      this.foto = event.target.files[0]
    }
  }
}
</script>

<style>

</style>

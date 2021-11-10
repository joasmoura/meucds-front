<template>
  <login titulo="ACESSE OU CADASTRE-SE, É TOTALMENTE GRÁTIS">
    <template v-slot:form1>
      <form @submit.prevent="registrar" enctype="multipart/form-data">
          <h1>Criar Conta</h1>

          <div class="social-container">
            <a href="#" class="social"><b-icon icon="facebook" /></a>
            <a href="#" class="social"><b-icon icon="google" /></a>
          </div>

          <div class="d-flex flex-row align-items-center mt-2 mb-2">
            <span class="mr-3">Escolha uma foto de perfil </span>
            <label for="foto_usuario" style="cursor:pointer">
              <input type="file" id="foto_usuario" @change="changeFoto" accept="image/*" class="d-none">
              <b-avatar size="72px" :src="(previewFoto ? previewFoto : '')" class="avatar mt-1"></b-avatar>
            </label>
          </div>

          <input type="text" v-model="name" placeholder="Nome" />
          <b-form-group label="" >
            <b-form-radio-group
              v-model="tipo"
              :options="tipos"
              button-variant="outline-primary"
              size="md"
              buttons
            ></b-form-radio-group>
          </b-form-group>

          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Senha" />
          <b-overlay
            :show="registrando"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
            <b-button type="submit" class="botao">Cadastre-se</b-button>
          </b-overlay>
        </form>

         <b-modal v-model="modalRecuperarSenha" centered title="Recuperar Senha" hide-footer>
          <input type="email" v-model="email" @change="recuperar" placeholder="Email" class="form-control"/>

          <div class="d-flex flex-row justify-content-between my-3">
            <div>
              <b-overlay
                :show="enviando"
                rounded
                opacity="0.6"
                spinner-small
                spinner-variant="primary"
                class="d-inline-block"
              >
                <b-button variant="success" @click="recuperar" v-bind:disabled="enviando">Confirmar</b-button>
              </b-overlay>
            </div>
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
        <b-overlay
          :show="entrando"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-button type="submit" class="botao">Entrar</b-button>
        </b-overlay>
      </form>
    </template>

    <template v-slot:left>
      <h1>Bem vindo de volta!</h1>
      <p>Para se manter conectado conosco, faça o login com suas informações pessoais</p>
      <b-button class="ghost botao border-white" id="signIn" @click="$emit('containerRemove')">Entrar</b-button>
    </template>

    <template v-slot:right>
      <h1>Meu Cds</h1>
      <p>Insira seus dados pessoais e faça parte de nosso time</p>
      <b-button class="ghost botao border-white" id="signUp" @click="$emit('containerAdd')">Cadastre - se</b-button>
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
      previewFoto: '',
      modalRecuperarSenha: false,
      enviando: false,
      registrando: false,
      entrando: false,
      tipo: 'D',
      tipos: [
        { value: 'D', text: 'Sou Divulgador' },
        { value: 'A', text: 'Sou Artista' }
      ]
    }
  },
  created () {

  },
  methods: {
    async registrar () {
      this.registrando = true
      const form = new FormData()
      form.append('name', this.name)
      form.append('tipo', this.tipo)
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
            text: 'Algo deu errado ao cadastrar!',
            icon: 'warning',
            timer: 2000
          })
        }
        this.registrando = false
      }).catch((e) => {
        this.registrando = false
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
      this.entrando = true
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      }).then(() => {
        console.log('Sucesso')
        this.entrando = false
      }).catch((e) => {
        this.entrando = false
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
      this.enviando = true
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

        this.modalRecuperarSenha = false
        this.enviando = false
      })
    },

    changeFoto (e) {
      const arquivo = e.target.files || e.dataTransfer.files
      if (!arquivo.length) {
        return
      }

      this.foto = arquivo[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewFoto = e.target.result
      }
      reader.readAsDataURL(arquivo[0])
    }
  }
}
</script>

<style>

</style>

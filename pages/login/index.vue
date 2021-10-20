<template>
  <b-container class="my-5">
    <h2>CADASTRE - SE GRÁTIS </h2>
    <div class="container-form" id="container">
      <div class="form-container sign-up-container">
        <form @submit.prevent="registrar">
          <h1>Criar Conta</h1>

          <div class="social-container">
            <a href="#" class="social"><b-icon icon="facebook" /></a>
            <a href="#" class="social"><b-icon icon="google" /></a>
          </div>

          <span>Escolha uma foto de perfil</span>
          <input type="file" id="foto" name="foto_usuario" accept="image/*" defaultValue="Insira a foto padrão">
          <input type="text" v-model="name" placeholder="Nome" />
          <input type="email" v-model="email" placeholder="Email" />
          <input type="password" v-model="password" placeholder="Senha" />
          <b-button type="submit">Cadastre - se</b-button>
        </form>
      </div>

      <div class="form-container sign-in-container">
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
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Bem vindo de volta!</h1>
            <p>Para se manter conectado conosco, faça o login com suas informações pessoais</p>
            <b-button class="ghost" id="signIn" @click="containerRemove">Entrar</b-button>
          </div>

          <div class="overlay-panel overlay-right">
            <h1>Meu Cds</h1>
            <p>Insira seus dados pessoais e faça parte de nosso time</p>
            <b-button class="ghost" id="signUp" @click="containerAdd">Cadastre - se</b-button>
          </div>
        </div>
      </div>
    </div>

    <b-modal v-model="modalRecuperarSenha" centered title="Recuperar Senha" hide-footer>
      <input type="email" v-model="email" placeholder="Email" class="form-control"/>

      <div class="d-flex flex-row justify-content-between my-3">
        <div><b-button variant="success" @click="recuperar">Confirmar</b-button></div>
        <div><b-button variant="danger">Cancelar</b-button></div>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      foto: '',
      modalRecuperarSenha: false
    }
  },
  created () {
    if (this.$auth.loggedIn) {
      this.$router.push('/conta')
    }
  },
  methods: {
    containerAdd () {
      const container = document.getElementById('container')
      container.classList.add('right-panel-active')
    },
    containerRemove () {
      const container = document.getElementById('container')
      container.classList.remove('right-panel-active')
    },
    async registrar () {
      await this.$axios.post('/registrar', {
        name: this.name,
        email: this.email,
        password: this.password
      }).then((r) => {
        if (r.data.status) {
          if (r.data.user) {
            this.$auth.setUser(r.data.user)
            this.$auth.setUserToken(r.data.authenticationToken)
            this.$router.push('/conta')
          } else {
            this.$router.push('/login')
          }
        } else {
          alert('Algo deu errado ao cadastrar!')
        }
      }).catch((erro) => {
        alert('Algo deu errado ao cadastrar!')
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
      }).catch((erro) => {
        console.log('Erro')
        console.log(erro)
      })
    },
    async recuperar () {
      await this.$axios.post('recuperar-senha', {
        email: this.email
      }).then((r) => {
        if (r.data.status) {
          alert('Enviaremos para sua caixa de email as instruções para recuperar sua senha!')
        } else {
          alert('Não foi possível encontrar sua conta! Verifique se seu email está correto!')
        }
      })
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

  h1 {
    font-weight: bold;
    margin: 0;
  }

  h2 {
    text-align: center;
  }

  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 20px 0 30px;
  }

  .container-form form {
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
  }

  .container-form input {
    background-color: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
  }

  .container-form {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    position: relative;
    overflow: hidden;
    max-width: 100%;
    min-height: 480px;
  }

  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
  }

  .sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
  }

  .container-form.right-panel-active .sign-in-container {
    transform: translateX(100%);
  }

  .sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
  }

  .container-form.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.6s;
  }

  @keyframes show {
    0%, 49.99% {
      opacity: 0;
      z-index: 1;
    }

    50%, 100% {
      opacity: 1;
      z-index: 5;
    }
  }

  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
  }

  .container-form.right-panel-active .overlay-container{
    transform: translateX(-100%);
  }

  .overlay {
    background: #FF416C;
    background: -webkit-linear-gradient(to right, #FF4B2B, #FF416C);
    background: linear-gradient(to right, #FF4B2B, #FF416C);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #FFFFFF;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
      transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .container-form.right-panel-active .overlay {
      transform: translateX(50%);
  }

  .overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .overlay-left {
    /* transform: translateX(-20%); */
  }

  .container.right-panel-active .overlay-left {
    transform: translateX(0);
  }

  .overlay-right {
    right: 0;
    transform: translateX(0);
  }

  .container.right-panel-active .overlay-right {
    transform: translateX(20%);
  }

  .social-container {
    margin: 20px 0;
  }

  .social-container a {
    border: 1px solid #DDDDDD;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
  }
</style>

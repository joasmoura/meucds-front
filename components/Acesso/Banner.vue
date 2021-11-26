<template>
<div>
    <b-card
    overlay
    :img-src="(previewBanner ? previewBanner : ($auth.user.banner ? $auth.user.banner : '' ))"
    img-alt=""
    text-variant="white"
    title=""
    sub-title=""
    class="banner_conta"
  >
    <b-card-text>
      <b-button
      pill
      variant="light"
      v-if="!srcBanner"
      @click="selecionarBanner"
      title="Alterar Banner"
      class="button-banner"><b-icon icon="pencil-square"></b-icon> <span>1900x240</span></b-button>

      <b-button
      pill
      variant="danger"
      v-if="srcBanner"
      @click="cancelarEdicaoBanner"
      title="Cancelar"
      class="button-banner"><b-icon icon="x-circle"></b-icon></b-button>

      <b-button
      pill
      variant="success"
      v-if="srcBanner"
      @click="confirmarEdicaoBanner"
      title="Confirmar"
      class="button-banner confirmar-banner"><b-icon icon="check-circle"></b-icon></b-button>

      <input type="file" id="banner" class="d-none" @change="carregaBanner">
    </b-card-text>
  </b-card>

  <div class="box-foto position-relative">
    <label for="foto" style="cursor: pointer;">
      <b-avatar size="72px" :src="(previewFoto ? previewFoto : ($auth.user.foto ? $auth.user.foto : ''))" class="avatar"></b-avatar>
      <sub>200x200</sub>
    </label>
    <input type="file" id="foto" class="d-none" @change="carregaFoto">

    <b-button
        pill
        variant="danger"
        v-if="srcFoto"
        @click="cancelarEdicaoFoto"
        title="Cancelar"
        class="button-banner"><b-icon icon="x-circle"></b-icon></b-button>

        <b-button
        pill
        variant="success"
        v-if="srcFoto"
        @click="confirmarEdicaoFoto"
        title="Confirmar"
        class="button-banner confirmar-banner"><b-icon icon="check-circle"></b-icon></b-button>
  </div>
</div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  data () {
    return {
      srcBanner: '',
      previewBanner: '',

      srcFoto: '',
      previewFoto: ''
    }
  },
  methods: {
    selecionarBanner () {
      const banner = document.getElementById('banner')
      banner.click()
    },
    async confirmarEdicaoBanner () {
      const form = new FormData()
      if (this.srcBanner) {
        form.append('banner', this.srcBanner)
        await this.$axios.post('alterar-banner', form).then((r) => {
          if (r.status) {
            this.srcBanner = ''

            Swal.fire({
              title: 'Sucesso',
              text: 'Banner alterado!',
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
      } else {
        alert('Nenhuma Imagem foi selecionada ainda!')
      }
    },
    async confirmarEdicaoFoto () {
      const form = new FormData()
      if (this.srcFoto) {
        form.append('foto', this.srcFoto)
        await this.$axios.post('alterar-foto', form).then((r) => {
          if (r.status) {
            this.srcFoto = ''
            Swal.fire({
              title: 'Sucesso',
              text: 'Foto alterada!',
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
      } else {
        alert('Nenhuma Imagem foi selecionada ainda!')
      }
    },
    carregaBanner (e) {
      this.srcBanner = ''
      const arquivo = e.target.files || e.dataTransfer.files
      if (!arquivo.length) {
        return
      }

      this.srcBanner = arquivo[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewBanner = e.target.result
      }
      reader.readAsDataURL(arquivo[0])
    },
    carregaFoto (e) {
      this.srcFoto = ''
      const arquivo = e.target.files || e.dataTransfer.files
      if (!arquivo.length) {
        return
      }

      this.srcFoto = arquivo[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewFoto = e.target.result
      }
      reader.readAsDataURL(arquivo[0])
    },
    cancelarEdicaoBanner () {
      this.previewBanner = ''
      this.srcBanner = ''
    },
    cancelarEdicaoFoto () {
      this.previewFoto = ''
      this.srcFoto = ''
    },
    alertaErro (erro) {
      Swal.fire({
        title: 'Alerta',
        text: erro,
        icon: 'warning'
      })
    }
  }
}
</script>

<style>
.banner_conta{
  margin-top: 10px;
  background: #f2f2f2;
  min-height: 100px;
  max-height: 180px;
  position:relative;
}

.banner_conta img{
  height:100%;
}

.banner_conta .button-banner{
  position: absolute;
  right: 3px;
  top:3px;
}

.banner_conta .confirmar-banner{
  right: 50px;
}

.box-foto{
  padding-left: 10px;
  margin-top: -30px;
}

.box-foto .avatar{

}

</style>

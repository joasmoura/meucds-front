<template>
<Acesso>
  <div class="d-flex flex-row justify-content-between justify-items-center">
      <h3>{{id ? 'Editar CD' : 'Cadastrar CD'}}</h3>
      <div>
        <b-button to="/conta" variant="link"><b-icon icon="arrow-left" /> Voltar</b-button>
        <b-button v-if="id" variant="primary" size="sm" to="/conta/cd/form"><b-icon icon="plus" /> cd</b-button>
      </div>
  </div>

  <b-form @submit.prevent="salvar" class=" mb-5">
     <b-card no-body class="w-75 m-auto card-upload">
      <b-tabs v-model="tabIndex" small card justified>
        <b-tab title="1">
          <div :class="(nomes.length === 0 ? 'box-select-upload' : 'box-select-upload-2')">
            <span v-if="nomes.length" class="text-white w-100 text-add"><b-icon icon="plus"></b-icon> Adicionar mais mp3</span>
            <input type="file" multiple accept="audio/mp3"  @change="selectAudios" class="form-upload">
          </div>

          <div v-if="nomes.length">
            <Upload v-for="(n, key) in nomes" :key="key" :i="key" v-on:remover="(k) => removerMp3(k)" :remover="true">
              <template v-slot:numero>{{montaNumero(key)}}</template>
              <template v-slot:input><input type="text" class="form-control" v-model="n.nome" placeholder="Título"></template>
              <template v-slot:letra>
                <editor
                  api-key="no-api-key"
                  v-model="n.letra"
                  :init="{
                    menubar: false
                  }"
                />
              </template>
            </Upload>
          </div>
        </b-tab>

        <b-tab title="2">
          <b-row>
            <b-col md="9">
              <b-row>
                <b-col v-if="$auth.user.tipo === 'D'" md="12">
                  <b-form-group label="Artista*" label-for="input-artista" >
                    <b-form-input :readonly="id !== ''" id="input-artista" v-model="artista" type="text" />
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Títtulo do cd*" label-for="input-nome" >
                    <b-form-input :readonly="id !== ''" id="input-nome" v-model="titulo" type="text" />
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Descrição do cd*" label-for="input-descricao" >
                    <b-form-textarea
                      v-model="descricao"
                      id="input-descricao"
                      size="lg"
                    ></b-form-textarea>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Categoria*" label-for="input-categoria" >
                    <b-form-select
                    v-model="categoria"
                    :options="categorias"
                    id="input-categoria"
                    value-field="item"
                    text-field="name"
                    ></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Youtube" label-for="input-youtube" >
                    <b-form-input id="input-youtube" v-model="youtube" type="text" />
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-radio-group
                    v-model="publicacao"
                    :options="publicacoes"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-radio-group>
                </b-col>

                <b-col md="12">
                  <b-card title="" sub-title="">
                    <b-card-text>
                      <div v-if="publicacao === 'S'">
                        <b-form-radio-group
                          v-model="tipoPublicacao"
                          :options="tiposPublicacao"
                          class="mb-0"
                          value-field="item"
                          text-field="name"
                          disabled-field="notEnabled"
                          buttons
                          button-variant="outline-primary"
                        ></b-form-radio-group>

                        <div class="infoPublicacao">
                          {{
                            (tipoPublicacao === 'PL' ? 'O cd ficará visível para todos' : '')+
                            (tipoPublicacao === 'PR' ? 'O cd ficará visível somente para você' : '')+
                            (tipoPublicacao === 'NL' ? 'Visível apenas para quem obter o link do cd' : '')
                          }}
                        </div>
                      </div>

                      <div v-else>
                        <b-row>
                          <b-col md=12 class="infoPublicacao">A publicação ficará privada até a data e horário escolhidos.</b-col>
                          <b-col md="6">
                            <b-form-group label="Data para publicação*" label-for="input-data-publicacao" >
                              <b-form-input id="input-data-publicacao" v-model="dataPublicacao" type="date" />
                            </b-form-group>
                          </b-col>

                          <b-col md="6">
                            <b-form-group label="Hora para publicação*" label-for="input-hora-publicacao" >
                              <b-form-input id="input-hora-publicacao" v-model="horaPublicacao" type="time" />
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </div>
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
            </b-col>

            <b-col md="3">
              <span class="ident-capa">Capa <sub>500x500</sub></span>
              <b-card
                title=""
                :img-src="(previewCapa ? previewCapa : '/capa-cd.jpg')"
                img-alt=""
                img-top
                tag="article"
                style="max-width: 20rem; cursor:pointer;"
                class="mb-0 capa"
                @click="selecionarCapa"
              >
                <b-card-text class="d-flex p-0 m-0">
                  <input type="file" id="capa" class="d-none" accept="image/*" @change="carregaCapa">
                </b-card-text>
              </b-card>
              <span v-if="previewCapa" class="cancel-capa" @click="cancelCapa"><b-icon icon="trash" /></span>
            </b-col>
          </b-row>
        </b-tab>

        <b-tab title="4">
          <div v-if="nomes.length">
            <div v-for="(n, key) in nomes" :key="key">
              <Upload v-if="!n.id" :i="key" v-on:remover="(k) => removerMp3(k)" :remover="false">
                <template v-slot:numero>{{montaNumero(key)}}</template>
                <template v-slot:input>
                  <span>{{n.nome}}</span>
                  <b-progress min="0" max="100" v-model="n.progress" class="w-100"/>
                </template>
              </Upload>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>

    <!-- Control buttons-->
    <div class="text-center">
      <b-button-group class="mt-2">
        <b-button @click="tabIndex = 0" v-if="(nomes.length && tabIndex > 0)" class="btn-upload">MÚSICAS</b-button>
        <b-button @click="proximo" v-if="tabIndex === 0" class="btn-upload">PRÓXIMO</b-button>
        <b-overlay
            :show="salvando"
            rounded
            opacity="0.6"
            spinner-small
            spinner-variant="primary"
            class="d-inline-block"
          >
          <b-button type="submit" v-if="tabIndex == 1" class="btn-upload">{{(id ? 'SALVAR' : 'FINALIZAR')}}</b-button>
        </b-overlay>
      </b-button-group>
    </div>
  </b-form>
</Acesso>
</template>

<script>
import Swal from 'sweetalert2'
import Editor from '@tinymce/tinymce-vue'
import Acesso from '@/components/Acesso'
import Upload from '@/components/Acesso/Upload'

export default {
  middleware: 'auth',
  data () {
    return {
      id: '',
      artista: '',
      titulo: '',
      tabIndex: 0,
      musicas: [],
      mp3: [],
      nomes: [],
      descricao: '',
      categorias: [],
      categoria: '',
      publicacao: 'S',
      publicacoes: [
        { item: 'S', name: 'Salvar ou publicar' },
        { item: 'P', name: 'Programar' }
      ],

      tipoPublicacao: 'PL',
      tiposPublicacao: [
        { item: 'PL', name: 'Público' },
        { item: 'PR', name: 'Privado' },
        { item: 'NL', name: 'Não Listado' }
      ],
      dataPublicacao: '',
      horaPublicacao: '',
      youtube: '',
      capa: '',
      previewCapa: '',
      salvando: false,
      form: null
    }
  },
  components: { Acesso, Upload, Editor },
  created () {
    this.getCantores()
    this.getCategorias()

    const param = this.$route.params.form

    if (param !== 'form') {
      this.id = param
      this.getCd()
    }
  },
  methods: {
    proximo () {
      if (this.nomes.length) {
        this.tabIndex++
      } else {
        Swal.fire({
          title: 'Alerta',
          text: 'Necessário selecionar as músicas do cd!',
          icon: 'warning'
        })
      }
    },
    getCd () {
      this.tabIndex++
      this.$axios.get(`/cds/${this.id}/edit`).then((r) => {
        const cd = r.data.cd
        if (cd) {
          this.titulo = cd.titulo
          this.artista = cd.artista
          this.descricao = cd.texto
          this.categoria = cd.categoria_id
          this.youtube = cd.youtube
          this.publicacao = cd.publicacao
          this.tipoPublicacao = cd.tipo_publicacao
          this.previewCapa = cd.capa_mini

          if (Array.from(cd.musicas).length) {
            this.nomes = cd.musicas.map((m) => {
              return {
                id: m.id,
                nome: m.nome.replace('.mp3', '').replace('.MP3', ''),
                letra: m.letra
              }
            })
          }
        } else {
          this.tabIndex = 0
        }
      })
    },
    getCantores () {

    },
    async getCategorias () {
      const url = this.$nuxt._route.path
      const categorias = this.$store.state.categorias.list
      if (Array.from(categorias).length) {
        this.categorias = categorias.map((c) => {
          return {
            name: c.nome,
            item: c.id
          }
        })
      } else {
        await this.$axios.get('categorias').then((r) => {
          const categorias = r.data
          if (Array.from(categorias).from) {
            categorias.map((c, i) => {
              this.$store.commit('categorias/add', {
                id: c.id,
                nome: c.nome,
                url: c.url,
                mostra: (i <= 4),
                active: (url === '/categoria' + c.url || url === '/artistas-top' + c.url),
                img: c.img
              })

              this.categorias.push({
                name: c.nome,
                item: c.id
              })

              return c
            })
          }
        })
      }
    },
    salvar () {
      if ((this.$auth.user.tipo === 'D' && !this.artista) || !this.titulo || !this.categoria) {
        Swal.fire({
          title: 'Alerta',
          text: 'Os campos marcados com * são obrigatórios!',
          icon: 'warning'
        })
        return
      }

      this.salvando = true

      this.form = new FormData()

      if (this.capa) {
        this.form.append('capa', this.capa)
      }

      if (this.$auth.user.tipo === 'D') {
        this.form.append('artista', this.artista)
      }

      if (this.id) {
        this.form.append('id', this.id)
      }
      this.form.append('titulo', this.titulo)
      this.form.append('youtube', this.youtube)
      this.form.append('descricao', this.descricao)
      this.form.append('categoria', this.categoria)
      this.form.append('publicacao', this.publicacao)
      this.form.append('tipo_publicacao', this.tipoPublicacao)
      this.form.append('data_publicacao', this.dataPublicacao)
      this.form.append('hora_publicacao', this.horaPublicacao)

      if (this.id) {
        this.atualizar()
      } else {
        this.criar()
      }
    },
    async criar () {
      await this.$axios.post('cds', this.form).then((r) => {
        const cd = r.data
        if (cd.status) {
          this.upload(cd.cd.id)
        }
      }).catch((e) => {
        const erros = e.response.data
        if (erros) {
          for (const erro in erros.errors) {
            this.alertaErro(erros.errors[erro][0])
          }
        }
        this.salvando = false
      })
    },
    async atualizar () {
      const musicas = this.nomes.filter(m => m.id !== null)
      if (musicas.length) {
        musicas.forEach((m, i) => {
          this.form.append(`musicas[${i}][id]`, m.id)
          this.form.append(`musicas[${i}][nome]`, m.nome)
          this.form.append(`musicas[${i}][letra]`, m.letra)
        })
      }
      await this.$axios.post(`cds/${this.id}`, this.form, {
        params: {
          _method: 'PUT'
        }
      }).then((r) => {
        const cd = r.data
        if (cd.status) {
          if (this.musicas.length) {
            this.upload(this.id)
          } else {
            Swal.fire({
              text: 'Cd salvo com sucesso!',
              icon: 'success',
              timer: 1500
            })
            this.salvando = false
          }
        }
      }).catch((e) => {
        const erros = e.response.data
        if (erros) {
          for (const erro in erros.errors) {
            this.alertaErro(erros.errors[erro][0])
          }
        }
        this.salvando = false
      })
    },
    async upload (cdId) {
      const nomes = this.nomes.filter(m => !m.id)
      if (this.musicas.length) {
        this.tabIndex++
        for (let i = 0; i < this.musicas.length; i++) {
          const form = new FormData()
          form.append('musica', this.musicas[i])
          form.append('titulo', nomes[i].nome)
          form.append('letra', nomes[i].letra)

          await this.$axios.post(`cds/upload/${cdId}`, form, {
            onUploadProgress: (u) => {
              nomes[i].progress = Math.round(u.loaded * 100 / u.total)
            }
          }).then(() => {
            if (i === (this.musicas.length - 1)) {
              Swal.fire({
                text: 'Cd salvo com sucesso!',
                icon: 'success',
                timer: 1500
              })
              if (this.$route.params.form !== 'form') {
                this.getCd()
                this.tabIndex = 1
              }
              this.$router.push(`/conta/cd/${cdId}`)
            }
          }).catch((e) => {
            Swal.fire({
              title: 'Erro',
              text: 'Não foi possível cadastrar esse cd. Caso o erro persista, entre em contato conosco!',
              icon: 'error'
            })
          })
        }
      }
      this.salvando = false
    },
    selectAudios (e) {
      const musicas = e.target.files || e.dataTransfer.files
      if (musicas.length) {
        musicas.forEach((m) => {
          this.musicas.push(m)
          this.nomes.push({
            nome: m.name.replace('.mp3', ''),
            letra: '',
            progress: 0
          })
        })
      }
    },
    async removerMp3 (id) {
      if (this.id) {
        const musica = this.nomes[id]
        if (musica) {
          await this.$axios.get(`cds/remover-musica/${musica.id}`).then((r) => {
            if (r.data.status) {
              Swal.fire({
                title: 'Sucesso',
                text: 'Música removida',
                timer: 1500,
                icon: 'success'
              })
            } else {
              Swal.fire({
                title: 'Alerta',
                text: 'Música não pode ser removida',
                timer: 1500,
                icon: 'warning'
              })
              return false
            }
          })
        }
      }

      this.nomes.splice(id, 1)

      const musicas = Array.from(this.musicas)
      musicas.splice(id, 1)
      this.musicas = musicas
    },
    selecionarCapa () {
      document.getElementById('capa').click()
    },
    carregaCapa (e) {
      this.srcFoto = ''
      const arquivo = e.target.files || e.dataTransfer.files
      if (!arquivo.length) {
        return
      }

      this.capa = arquivo[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewCapa = e.target.result
      }
      reader.readAsDataURL(arquivo[0])
    },
    cancelCapa () {
      if (this.id) {
        this.$axios.get(`cds/remover-capa/${this.id}`)
      }
      this.previewCapa = ''
      this.capa = ''
    },
    montaNumero (n) {
      const numero = n + 1
      return numero
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
  .card-upload .nav-link{
    background: #f2f2f2;
    border-radius:100%;
    display: inline-block;
    width: 40px !important;
    height: 40px !important;
    border:none;
    z-index: 5;
    position: relative;
    padding:10px;
  }

  .card-upload .nav-tabs::before{
    content: "";
    position:absolute;
    width:65%;
    background: #f2f2f2;
    height: 1px;
    top:30px;
    left:18%;
    z-index: 1;
  }

  .card-upload .nav-link.active{
    background: #FF416C;
    color:#FFF;
  }

  .card-upload{
    border: none;
  }

  .card-upload .card-header{
    background: transparent !important;
    border: none;
  }

  .form-upload .nav-item .nav-link{
    display: initial !important;
    border-radius: 100%  !important;
    border: 1px solid #999
  }

  .box-select-upload{
    z-index:2;
    height: 350px;
    background: url('~static/bgupload.jpg');
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 10px;
  }

  .box-select-upload .form-upload{
    opacity: 0;
    height: 350px;
    width: 100%;
    cursor: pointer;
  }

  .box-select-upload-2{
    height: 100px;
    background: #DFAAAF;
    position:relative;
    border-radius: 10px;
    border: 2px dashed #8b8283;
  }
  .box-select-upload-2:hover{
    background: #fac0c5;
  }

  .box-select-upload-2 .form-upload{
    opacity: 0;
    height: 100px;
    width: 100%;
    cursor: pointer;
    position:absolute;
    top:0;
    z-index:100;
  }

  .box-select-upload-2 .text-add{
    position: absolute;
    z-index:1;
    top:0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
  }

  .infoPublicacao{
    color: #555;
  }

  .capa{
    border: 0;
  }

  .capa .card-body{
    padding: 0;
    margin: 0;
  }

  .ident-capa{
    background: #FF416C;
    border-radius: 10px 10px 0 0;
    display: block;
    color: #FFF;
    text-align: center;
    padding: 3px;
  }

  .cancel-capa{
    background: #FF4B2B;
    border-radius: 0 0 10px 10px ;
    display: block;
    color: #FFF;
    text-align: center;
    padding: 3px;
    cursor: pointer;
  }

  .btn-upload{
    border-radius: 0;
    width: 200px;
    background: #FF416C;
    color:#FFF;
    border:none;
  }

  .btn-upload:hover, .btn-upload:active, .btn-upload:focus{
    background: #FF4B2B !important;
  }
</style>

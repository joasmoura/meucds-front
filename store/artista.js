export const state = () => ({
  list: []
})

export const mutations = {
  add (state, artista) {
    state.list.push(artista)
  },
  remove (state, { artista }) {
    state.list.splice(state.list.indexOf(artista), 1)
  },

  setDownloadsCd (state, { cd, numDownloads }) {
    const artista = state.list.find(a => parseInt(cd.artista_id) === parseInt(a.id))
    if (artista) {
      const cdEncontrado = artista.cds.find(c => parseInt(cd.id) === parseInt(c.id))
      if (cdEncontrado) {
        cdEncontrado.num_download = numDownloads
      }
    }
  },
  setPlaysCd (state, { cd, numPlays }) {
    const artista = state.list.find(a => parseInt(cd.artista_id) === parseInt(a.id))
    if (artista) {
      const cdEncontrado = artista.cds.find(c => parseInt(cd.id) === parseInt(c.id))
      if (cdEncontrado) {
        cdEncontrado.num_play = numPlays
      }
    }
  }
}

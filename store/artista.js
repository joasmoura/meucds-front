export const state = () => ({
  list: []
})

export const mutations = {
  add (state, artista) {
    state.list.push(artista)
  },
  remove (state, { artista }) {
    state.list.splice(state.list.indexOf(artista), 1)
  }
}

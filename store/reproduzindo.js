export const state = () => ({
  list: [],
  currentAudio: []
})

export const mutations = {
  add (state, musica) {
    state.list.push(musica)
  },
  addCurrent (state, musica) {
    state.currentAudio = musica
  },
  remove (state, { musica }) {
    state.list.splice(state.list.indexOf(musica), 1)
  },
  limpar (state) {
    state.list = []
  }
}

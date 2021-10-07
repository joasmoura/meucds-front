export const state = () => ({
  list: []
})

export const mutations = {
  add (state, publicidade) {
    state.list.push(publicidade)
  },
  remove (state, { publicidade }) {
    state.list.splice(state.list.indexOf(publicidade), 1)
  }
}

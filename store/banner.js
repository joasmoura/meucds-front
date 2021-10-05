export const state = () => ({
  list: []
})

export const mutations = {
  add (state, banner) {
    state.list.push(banner)
  },
  remove (state, { banner }) {
    state.list.splice(state.list.indexOf(banner), 1)
  }
}

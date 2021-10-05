export const state = () => ({
  list: []
})

export const mutations = {
  add (state, categoria) {
    state.list.push({
      nome: categoria.nome,
      url: categoria.url,
      active: categoria.active,
      mostra: categoria.mostra
    })
  },
  sort (state, url) {
    const categorias = state.list
    const cat = categorias.sort((c) => {
      c.active = false
      if (url === c.url) {
        if (!c.mostra) {
          const categs = state.list.filter(l => l.mostra)
          const last = [...categs].pop()
          if (last) {
            last.mostra = false
            // if (last.active) {
            //   last.active = false
            // }
          }
        }
        c.active = true
        c.mostra = true
      } else if (c.url !== url) {
        c.active = false
      }

      return c
    })

    state.list = cat
  },
  remove (state, { categoria }) {
    state.list.splice(state.list.indexOf(categoria), 1)
  },
  ativa (state, categoria) {
    const categorias = state.list.filter(l => l.mostra)
    categorias.map((m) => {
      m.active = false
      return m
    })

    if (!categoria.mostra) {
      const last = [...categorias].pop()
      last.mostra = false

      categoria.active = !categoria.active
      categoria.mostra = !categoria.mostra
    } else {
      categoria.active = true
    }
  },
  setMostra (state, categoria) {
    const categorias = state.list.filter(l => l.mostra)
    const last = [...categorias].pop()
    last.mostra = false

    categoria.mostra = !categoria.mostra
  }
}

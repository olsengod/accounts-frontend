// import crossStorage from "cross-domain-storage"
import createHost from 'cross-domain-storage/host'
import createGuest from 'cross-domain-storage/guest'

// Vue.use(crossStorage)

const storageHost = createHost([
  // {
  //   origin: 'https://localhost:3000',
  //   allowedMethods: ['get', 'set', 'remove']
  // },
  {
    origin: 'https://torlight-stage.cereris.org',
    allowedMethods: ['get', 'set', 'remove']
  }
])

const accountsStorage = createGuest('https://accounts-dev.cereris.org')
// const accountsStorage = createGuest('https://localhost:3000')

export {
  storageHost,
  accountsStorage
}

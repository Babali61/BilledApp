
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message)
  return response.json()
}

class Api {
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  async post({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data}))
  }
  async delete({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'}))
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}

const getHeaders = (headers) => {
  const h = { }
  if (!headers.noContentType) h['Content-Type'] = 'application/json'
  const jwt = localStorage.getItem('jwt')
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}`
  return {...h, ...headers}
}

class ApiEntity {
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  async select({selector, headers = {}}) {
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  async list({headers = {}} = {}) {
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  async update({data, selector, headers = {}}) {
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  async create({data, headers = {}}) {
    return await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
  }
  async delete({selector, headers = {}}) {
    return await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
}



class Store {
  constructor() {
    // Utilise l'URL de l'API depuis les variables d'environnement ou localhost par défaut
    // Pour la production, l'URL sera injectée par Netlify
    const apiBaseUrl = window.API_BASE_URL || 'http://localhost:5678'
    
    // Logs de debug pour le déploiement
    console.log('🚀 BilledApp - Initialisation du Store')
    console.log('📍 URL de l\'API configurée:', apiBaseUrl)
    console.log('🌍 Environnement:', window.location.hostname === 'localhost' ? 'Développement' : 'Production')
    
    this.api = new Api({baseUrl: apiBaseUrl})
    
    // Test de connectivité API
    this.testApiConnection()
  }
  
  async testApiConnection() {
    try {
      console.log('🔍 Test de connexion à l\'API...')
      const response = await fetch(`${this.api.baseUrl}`)
      if (response.ok) {
        const data = await response.text()
        console.log('✅ API accessible:', data)
      } else {
        console.warn('⚠️ API répond mais avec une erreur:', response.status)
      }
    } catch (error) {
      console.error('❌ Erreur de connexion à l\'API:', error.message)
      console.log('💡 Vérifiez que l\'URL de l\'API est correcte:', this.api.baseUrl)
    }
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})
  users = () => new ApiEntity({key: 'users', api: this.api})
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})})

  ref = (path) => this.store.doc(path)

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})
  bills = () => new ApiEntity({key: 'bills', api: this.api})
}

export default new Store()
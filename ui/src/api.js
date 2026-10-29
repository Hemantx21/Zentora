import axios from 'axios'

const baseURL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:9000' : 'https://zentora-u5tc.onrender.com')
).replace(/\/+$/, '')

export default axios.create({ baseURL })

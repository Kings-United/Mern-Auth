import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:8080/auth'
})

export const googleAuth = (code) => API.get(`/google?code=${code}`)
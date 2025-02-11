import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

// Exemplo de uso:
//api.get('/posts/1').then(response => console.log(response.data));
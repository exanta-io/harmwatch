import axios from 'axios';

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default request;
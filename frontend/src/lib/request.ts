import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error('Base URL is not defined');
}

if (!baseURL.startsWith('https://')) {
  throw new Error('Base URL must start with https://');
}

const request = axios.create({
  baseURL,
  timeout: 20000,
  maxRedirects: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default request;

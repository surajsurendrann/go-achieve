import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://agilescrummodel.com:3000',
  headers: {
    Accept: 'application/json',
  },
});

// Set API key for all future requests
export const setApiKey = (key: string) => {
  api.defaults.headers.common['X-Redmine-API-Key'] = key;
};

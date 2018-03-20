import axios from 'axios';
import renderResult from './result';

// const corsProxy = '';
const corsProxy = 'https://crossorigin.me/';


export default (url) => {
  axios.get(corsProxy + url)
    .then((response) => {
      const { data } = response;
      // console.log(data);
      renderResult({ data });
    })
    .catch((error) => {
      renderResult({ error });
      // console.log(error);
    });
};


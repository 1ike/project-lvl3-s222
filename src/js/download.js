import axios from 'axios';
import renderResult from './result';


const corsProxy = 'https://crossorigin.me/';


export default (url, crossorigin = true) => {
  axios.get(crossorigin ? corsProxy + url : url)
    .then((response) => {
      const { data } = response;
      renderResult({ data });
    })
    .catch((error) => {
      renderResult({ error });
    });
};


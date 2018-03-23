import axios from 'axios';
import publishers from './publishers';


const corsProxy = 'https://crossorigin.me/';

const { alertPublisher, feedPublisher } = publishers;


export default (url, crossorigin = true) => {
  axios.get(crossorigin ? corsProxy + url : url)
    .then(
      (response) => {
        const { data } = response;
        alertPublisher.deliver('ALERT_CLOSE');
        feedPublisher.deliver('ADD_FEED', data);
      },
      error => alertPublisher.deliver('ALERT_OPEN', error),
    )
    .catch((error) => {
      console.log(error);
    });
};


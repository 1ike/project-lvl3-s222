import axios from 'axios';
import publishers from './publishers';


const corsProxy = 'https://crossorigin.me/';

const { alertPublisher, addFeedPublisher } = publishers;


export default (url, crossorigin = true) => {
  axios.get(crossorigin ? corsProxy + url : url)
    .then(
      (response) => {
        const { data } = response;
        alertPublisher.deliver(null);
        addFeedPublisher.deliver(data);
      },
      error => alertPublisher.deliver(error),
    )
    .catch((error) => {
      console.log(error);
    });
};


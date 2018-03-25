import $ from 'jquery';
import validator from 'validator';
import axios from 'axios';

import store from './store';
import publishers from './publishers';
import components from './components';


const {
  inputPublisher,
  alertPublisher,
  feedPublisher,
  modalPublisher,
} = publishers;
const {
  inputComponent,
  alertComponent,
  feedComponent,
  modalComponent,
} = components;

inputPublisher.subscribe(inputComponent);
alertPublisher.subscribe(alertComponent);
feedPublisher.subscribe(feedComponent);
modalPublisher.subscribe(modalComponent);


const form = document.getElementById(store.formID);
const input = document.getElementById(store.inputID);
const $modal = $(`#${store.modalID}`);


$modal.on('hidden.bs.modal', () => {
  modalPublisher.deliver('MODAL_CLOSE');
});


const getInputState = () => {
  const value = input.value.trim();
  return {
    isValid: !input.value || validator.isURL(value),
    value,
  };
};


const download = (urlInput) => {
  const proxyURL = 'https://crossorigin.me/';
  const crossorigin = true;
  const corsProxy = { proxyURL, crossorigin };
  const urls = urlInput ? [urlInput] : store.feeds.map(feed => feed.url);

  const downloadPromises = urls.map(url => axios.get(crossorigin ? proxyURL + url : url));


  Promise.all(downloadPromises)
    .then((responses) => {
      console.log(responses);
      alertPublisher.deliver('ALERT_CLOSE');
      feedPublisher.deliver('UPDATE_FEEDS', { responses, corsProxy });
    })
    .catch((error) => {
      alertPublisher.deliver('ALERT_OPEN', error);
      console.log(error); // eslint-disable-line
    })
    .then(() => {
      setTimeout(download, 5000);
    });
};

// const startUpdate = () => {
//   download();
// };


const inputOnChange = () => {
  inputPublisher.deliver('INPUT_CHANGE', getInputState());
};


input.addEventListener('change', () => {
  inputOnChange();
});
input.addEventListener('input', () => {
  inputOnChange();
});
input.addEventListener('keyup', () => {
  inputOnChange();
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  download(store.input.value);
});


// init
// setTimeout(startUpdate, 5000);
input.focus();
inputOnChange();

import $ from 'jquery';
import validator from 'validator';
import store from './store';
import publishers from './publishers';
import components from './components';


const {
  inputPublisher,
  alertPublisher,
  feedPublisher,
  modalPublisher,
  urlsPublisher,
} = publishers;
const {
  inputComponent,
  alertComponent,
  feedComponent,
  modalComponent,
  downloadComponent,
} = components;

inputPublisher.subscribe(inputComponent);
alertPublisher.subscribe(alertComponent);
feedPublisher.subscribe(feedComponent);
modalPublisher.subscribe(modalComponent);
urlsPublisher.subscribe(downloadComponent);


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

const inputOnChange = () => {
  inputPublisher.deliver('INPUT_CHANGE', getInputState());
};


// init
input.focus();
inputOnChange();


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
  urlsPublisher.deliver('DOWNLOAD_FEED');
});


const update = () => {
  urlsPublisher.deliver('UPDATE_FEEDS');
  setTimeout(update, 5000);
};
update();


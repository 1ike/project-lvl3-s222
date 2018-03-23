import $ from 'jquery';
import validator from 'validator';
import download from './download';
import store from './store';
import publishers from './publishers';
import components from './components';


const {
  inputPublisher, alertPublisher, feedPublisher, modalPublisher,
} = publishers;
const {
  inputComponent, alertComponent, feedComponent, modalComponent,
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

const inputOnChange = () => {
  inputPublisher.deliver('INPUT_CHANGE', getInputState());
};


// init
input.focus();
inputOnChange();


input.addEventListener('change', (e) => {
  inputOnChange();
});
input.addEventListener('input', (e) => {
  inputOnChange();
});
input.addEventListener('keyup', (e) => {
  inputOnChange();
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (store.input.isValid) download(store.input.value);
});

import $ from 'jquery';
import validator from 'validator';
import download from './download';
import store from './store';
import publishers from './publishers';
import renders from './renders';


const {
  inputValuePublisher, alertPublisher, addFeedPublisher, modalPublisher,
} = publishers;
const {
  renderInput, renderAlert, renderFeed, renderModal,
} = renders;

inputValuePublisher.subscribe(renderInput);
alertPublisher.subscribe(renderAlert);
addFeedPublisher.subscribe(renderFeed).subscribe(renderInput);
modalPublisher.subscribe(renderModal);


const form = document.getElementById(store.formID);
const input = document.getElementById(store.inputID);
const $modal = $(`#${store.modalID}`);


$modal.on('hidden.bs.modal', () => {
  modalPublisher.deliver({ title: '', body: '' });
});


const getInputState = () => {
  const value = input.value.trim();
  return {
    isValid: !input.value || validator.isURL(value),
    value,
  };
};

const inputOnChange = () => {
  inputValuePublisher.deliver(getInputState());
};


// init
input.focus();
inputOnChange();


input.addEventListener('change', (e) => {
  e.preventDefault();
  inputOnChange();
});
input.addEventListener('input', (e) => {
  e.preventDefault();
  inputOnChange();
});
input.addEventListener('keyup', (e) => {
  e.preventDefault();
  inputOnChange();
});
input.addEventListener('focus', (e) => {
  e.preventDefault();
  inputOnChange();
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (store.input.isValid) download(store.input.value);
});

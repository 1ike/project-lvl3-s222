import validator from 'validator';
import download from './download';
import store from './store';

const check = (input) => {
  if (!input.value || validator.isURL(input.value.trim())) {
    input.classList.remove('invalidInput');
    store.form.isValid = true;
  } else {
    input.classList.add('invalidInput');
    store.form.isValid = false;
  }
};

export default (data) => {
  const form = document.getElementById(data.formID);
  const input = document.getElementById(data.inputID);

  input.focus();

  input.addEventListener('change', (e) => {
    e.preventDefault();
    check(input);
  });
  input.addEventListener('input', (e) => {
    e.preventDefault();
    check(input);
  });
  input.addEventListener('keyup', (e) => {
    e.preventDefault();
    check(input);
  });
  input.addEventListener('focus', (e) => {
    e.preventDefault();
    check(input);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    download(input.value);
  });
};


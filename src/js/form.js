import validator from 'validator';
import download from './download';

const check = ($input) => {
  if (validator.isURL($input.val())) {
    $input[0].classList.remove('invalidInput');
  } else {
    $input[0].classList.add('invalidInput');
  }
};

export default (data) => {
  const $form = $(data.formSelector);
  const $input = $(data.inputSelector);

  check($input);

  $input.keyup((e) => {
    e.preventDefault();
    check($input);
  });

  $form.submit((e) => {
    e.preventDefault();
    download($input.val());
  });
};


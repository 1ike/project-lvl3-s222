import $ from 'jquery';
import 'bootstrap';
import store from './store';
import publishers from './publishers';

const { modalPublisher, inputValuePublisher } = publishers;

const $modal = $(`#${store.modalID}`);

const renderModal = () => {
  $modal.find('.modal-title').text(store.modal.title);
  $modal.find('.modal-body').text(store.modal.body);
};


const renderInput = () => {
  const input = document.getElementById(store.inputID);
  if (store.input.isValid) {
    input.classList.remove('invalidInput');
  } else {
    input.classList.add('invalidInput');
  }
  input.value = store.input.value;
  input.focus();
};

const renderAlert = () => {
  const alert = document.querySelector('.alert.alert-danger');
  const { error } = store;

  if (error) {
    alert.innerHTML = store.error.message;
    alert.classList.remove('d-none');
  } else {
    alert.classList.add('d-none');
    alert.innerHTML = '';
  }
};


const renderFeed = (feed) => {
  const feedElem = document.createElement('div');
  feedElem.classList.add('feed');
  feedElem.id = feed.id;

  const title = document.createElement('h2');
  title.innerHTML = feed.title;
  const description = document.createElement('p');
  description.innerHTML = feed.description;

  const items = document.createElement('ul');

  feed.articles.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');
    li.classList.add('mt-1');
    a.innerHTML = item.title;
    a.href = item.link;
    button.innerHTML = 'Description';
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'ml-2');
    button.type = 'button';
    button.dataset.toggle = 'modal';
    button.dataset.target = `#${store.modalID}`;
    li.appendChild(a);
    li.appendChild(button);
    items.appendChild(li);
    button.addEventListener('click', () => {
      store.modal.title = item.title;
      store.modal.body = item.description;
      modalPublisher.deliver();
    });
  });

  feedElem.appendChild(title);
  feedElem.appendChild(description);
  feedElem.appendChild(items);

  const container = document.getElementById('mainContainer');
  const firstItem = container.querySelector('.feed');
  container.insertBefore(feedElem, firstItem);

  store.input = { isValid: true, value: '' };
  inputValuePublisher.deliver();
};


export default {
  renderInput,
  renderAlert,
  renderFeed,
  renderModal,
};

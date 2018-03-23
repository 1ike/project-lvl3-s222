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


const renderFeed = () => {
  const feed = store.feeds[store.feeds.length - 1];
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
    li.classList.add('mt-1');
    a.innerHTML = item.title;
    a.href = item.link;
    li.appendChild(a);

    if (item.description) {
      const button = document.createElement('button');
      button.innerHTML = 'Description';
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'ml-2');
      button.type = 'button';
      button.dataset.toggle = 'modal';
      button.dataset.target = `#${store.modalID}`;
      button.addEventListener('click', () => {
        modalPublisher.deliver({ title: item.title, body: item.description });
      });
      li.appendChild(button);
    }

    items.appendChild(li);
  });

  feedElem.appendChild(title);
  feedElem.appendChild(description);
  feedElem.appendChild(items);

  const container = document.getElementById('mainContainer');
  const firstItem = container.querySelector('.feed');
  container.insertBefore(feedElem, firstItem);

  inputValuePublisher.deliver({ isValid: true, value: '' });
};


export default {
  renderInput,
  renderAlert,
  renderFeed,
  renderModal,
};

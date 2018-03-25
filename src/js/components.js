import $ from 'jquery';
import 'bootstrap';

import publishers from './publishers';
import store from './store';


const {
  feedPublisher,
  modalPublisher,
  inputPublisher,
} = publishers;


/**
 *   inputComponent
 */
const getDataInput = () => {
  const { input, inputID } = store;
  return { inputData: input, inputID };
};
const renderInput = ({ inputData, inputID }) => {
  const input = document.getElementById(inputID);
  if (inputData.isValid) {
    input.classList.remove('invalidInput');
  } else {
    input.classList.add('invalidInput');
  }
  input.value = inputData.value;
  input.focus();
};


/**
 *   alertComponent
 */
const getDataAlert = () => store.error;
const renderAlert = (error) => {
  const alert = document.querySelector('.alert.alert-danger');

  if (error) {
    alert.innerHTML = error.message;
    alert.classList.remove('d-none');
  } else {
    alert.classList.add('d-none');
    alert.innerHTML = '';
  }
};


/**
 *   feedComponent
 */
const getItemElem = (item, modalID) => {
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
    button.dataset.target = `#${modalID}`;
    button.addEventListener('click', () => {
      modalPublisher.deliver('MODAL_OPEN', {
        title: item.title,
        body: item.description,
      });
    });
    li.appendChild(button);
  }
  return li;
};

const updateArticles = (feed, modalID) => {
  const itemsList = document.querySelector(`#${feed.id} ul`);
  feed.updatedArticles.forEach((item) => {
    const li = getItemElem(item, modalID);
    itemsList.insertBefore(li, itemsList.firstChild);
  });
};

const getDataFeed = () => {
  const { feeds, modalID } = store;
  const updatedFeeds = feeds.filter((feed) => {
    const { updatedArticles } = feed;
    const wasAdded = !updatedArticles;
    const wasUpdated = updatedArticles && updatedArticles.length;
    return wasAdded || wasUpdated;
  });
  return {
    updatedFeeds,
    modalID,
  };
};
const renderFeed = ({ updatedFeeds, modalID }) => {
  if (updatedFeeds.length === 0) return;

  updatedFeeds.forEach((feed) => {
    const { id, updatedArticles } = feed;
    if (updatedArticles) {
      if (updatedArticles.length) {
        updateArticles(feed, modalID);
        return;
      }

      return;
    }

    const feedElem = document.createElement('div');
    feedElem.classList.add('feed');
    feedElem.id = id;

    const title = document.createElement('h2');
    title.innerHTML = feed.title;
    const description = document.createElement('p');
    description.innerHTML = feed.description;

    const items = document.createElement('ul');

    feed.articles.forEach((item) => {
      const li = getItemElem(item, modalID);
      items.appendChild(li);
    });

    feedElem.appendChild(title);
    feedElem.appendChild(description);
    feedElem.appendChild(items);

    const container = document.getElementById('mainContainer');
    const firstItem = container.querySelector('.feed');
    container.insertBefore(feedElem, firstItem);
  });
  feedPublisher.deliver('FEEDS_UPDATED');
  inputPublisher.deliver('INPUT_EMPTY');
};


/**
 *   modalComponent
 */
const getDataModal = () => {
  const { modal, modalID } = store;
  return { modal, modalID };
};
const renderModal = ({ modal, modalID }) => {
  const $modal = $(`#${modalID}`);
  $modal.find('.modal-title').text(modal.title);
  $modal.find('.modal-body').text(modal.body);
};


export default {
  inputComponent: { handler: renderInput, getData: getDataInput },
  alertComponent: { handler: renderAlert, getData: getDataAlert },
  feedComponent: { handler: renderFeed, getData: getDataFeed },
  modalComponent: { handler: renderModal, getData: getDataModal },
};

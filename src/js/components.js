import $ from 'jquery';
import 'bootstrap';
import axios from 'axios';

import publishers from './publishers';
import store from './store';


const {
  feedPublisher, modalPublisher, inputPublisher, alertPublisher,
} = publishers;


const getDataModal = () => {
  const { modal, modalID } = store;
  return { modal, modalID };
};
const renderModal = ({ modal, modalID }) => {
  const $modal = $(`#${modalID}`);
  $modal.find('.modal-title').text(modal.title);
  $modal.find('.modal-body').text(modal.body);
};


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
  const { modalID } = store;
  return {
    feed: store.feeds[store.feeds.length - 1],
    modalID,
  };
};
const renderFeed = ({ feed, modalID }) => {
  const { id, updatedArticles } = feed;
  if (updatedArticles) {
    if (updatedArticles.length) {
      updateArticles(feed, modalID);
      feedPublisher.deliver('FEEDS_UPDATED');
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

  inputPublisher.deliver('INPUT_EMPTY');
};


const getDataUpdateFeeds = () => {
  const { modalID, feeds } = store;
  const updatedFeeds = feeds.filter((feed) => {
    const { updatedArticles } = feed;
    return updatedArticles && updatedArticles.length;
  });
  return {
    updatedFeeds,
    modalID,
  };
};
const renderUpdateFeeds = ({ updatedFeeds, modalID }) => {
  if (!updatedFeeds.length) return;

  updatedFeeds.forEach((feed) => {
    updateArticles(feed, modalID);
  });
  feedPublisher.deliver('FEEDS_UPDATED');
};


const getDataURL = () => {
  const { urls } = store;
  return {
    urls,
    corsProxy: 'https://crossorigin.me/',
    crossorigin: true,
  };
};
const renderDownload = ({ urls, corsProxy, crossorigin }) => {
  urls.forEach((url) => {
    axios.get(crossorigin ? corsProxy + url : url)
      .then(
        (response) => {
          const { data } = response;
          alertPublisher.deliver('ALERT_CLOSE');
          feedPublisher.deliver('ADD_FEED', { data, url });
        },
        error => alertPublisher.deliver('ALERT_OPEN', error),
      )
      .catch((error) => {
        console.log(error); // eslint-disable-line
      });
  });
};

export default {
  inputComponent: { render: renderInput, getData: getDataInput },
  alertComponent: { render: renderAlert, getData: getDataAlert },
  feedComponent: { render: renderFeed, getData: getDataFeed },
  updateFeedsComponent: { render: renderUpdateFeeds, getData: getDataUpdateFeeds },
  modalComponent: { render: renderModal, getData: getDataModal },
  downloadComponent: { render: renderDownload, getData: getDataURL },
};

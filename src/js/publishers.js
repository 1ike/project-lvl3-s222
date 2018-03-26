import _ from 'lodash';

import Publisher from './Publisher';
import store from './store';


/**
 *   inputPublisher
 */
const inputStorekeeper = (data) => {
  store.input = data;
};

const inputEmptyStorekeeper = () => {
  store.input = {
    isValid: true,
    value: '',
  };
};

const inputPublisher = new Publisher({
  INPUT_CHANGE: inputStorekeeper,
  INPUT_EMPTY: inputEmptyStorekeeper,
});


/**
 *   urlsPublisher
 */
const addURLStorekeeper = () => {
  store.urlsForDownload = {
    urls: [store.input.value],
    isAdded: true,
  };
};

const urlAddedStorekeeper = () => {
  store.urlsForDownload = {
    urls: [],
    isAdded: false,
  };
};

const updateURLsStorekeeper = () => {
  store.urlsForDownload = {
    urls: store.feeds.map(feed => feed.url),
    isAdded: false,
  };
};

const urlsUpdatedStorekeeper = () => {
  store.urlsForDownload = {
    urls: [],
    isAdded: true,
  };
};

const urlsPublisher = new Publisher({
  ADD_URL: addURLStorekeeper,
  UPDATE_URLS: updateURLsStorekeeper,
  URL_ADDED: urlAddedStorekeeper,
  URLS_UPDATED: urlsUpdatedStorekeeper,
});


/**
 *   alertPublisher
 */
const alertOpenStorekeeper = (data) => {
  store.error = data;
};

const alertCloseStorekeeper = () => {
  store.error = null;
};

const alertPublisher = new Publisher({
  ALERT_OPEN: alertOpenStorekeeper,
  ALERT_CLOSE: alertCloseStorekeeper,
});


/**
 *   feedPublisher
 */
const getFeedData = (xmlDOM) => {
  const title = xmlDOM.querySelector('channel > title');
  const description = xmlDOM.querySelector('channel > description');

  const items = xmlDOM.querySelectorAll('item');
  const articles = [].map.call(items, (item) => {
    const articleTitle = item.querySelector('title');
    const articleLink = item.querySelector('link');
    const articleDescription = item.querySelector('description');
    return {
      title: articleTitle ? articleTitle.textContent : '',
      link: articleLink ? articleLink.textContent.trim() : '',
      description: articleDescription ? articleDescription.textContent : '',
    };
  });

  return {
    title: title ? title.textContent : '',
    description: description ? description.textContent : '',
    articles,
  };
};

const updateFeedsStorekeeper = ({ responses }) => {
  responses.forEach(({ data, request }) => {
    const parser = new DOMParser();
    const xmlDOM = parser.parseFromString(data, 'application/xml');
    const parsedData = getFeedData(xmlDOM);

    const { proxyURL, crossorigin } = store.proxy;
    const { responseURL } = request;
    const url = crossorigin ? responseURL.replace(proxyURL, '') : responseURL;
    const { feeds } = store;
    const feed = _.find(feeds, { url });

    if (feed) {
      const diff = _.differenceBy(parsedData.articles, feed.articles, 'link');
      const filteredFeeds = feeds.filter(f => f.id !== feed.id);
      store.feeds = [...filteredFeeds, {
        ...feed,
        ...parsedData,
        updatedArticles: diff,
      }];
    } else {
      store.feeds = [...store.feeds, {
        ...parsedData,
        id: _.uniqueId('feed_'),
        url,
      }];
    }
  });
};

const feedsUpdatedStorekeeper = () => {
  const { feeds } = store;
  const updatedFeeds = feeds.map(feed => ({
    ...feed,
    updatedArticles: [],
  }));
  store.feeds = updatedFeeds;
};

const feedPublisher = new Publisher({
  UPDATE_FEEDS: updateFeedsStorekeeper,
  FEEDS_UPDATED: feedsUpdatedStorekeeper,
});


/**
 *   modalPublisher
 */
const modalOpenStorekeeper = (data) => {
  store.modal = data;
};

const modalCloseStorekeeper = () => {
  store.modal = {
    title: '',
    body: '',
  };
};

const modalPublisher = new Publisher({
  MODAL_OPEN: modalOpenStorekeeper,
  MODAL_CLOSE: modalCloseStorekeeper,
});


export default {
  inputPublisher,
  urlsPublisher,
  alertPublisher,
  feedPublisher,
  modalPublisher,
};

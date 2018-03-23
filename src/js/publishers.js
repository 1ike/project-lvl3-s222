import Publisher from './Publisher';
import store from './store';

const uid = (() => {
  let id = 0;
  return () => {
    const result = id === 0 ? 0 : id;
    id += 1;
    return result;
  };
})();

const getFeedData = (xmlDOM) => {
  const title = xmlDOM.querySelector('channel > title');
  const description = xmlDOM.querySelector('channel > description');
  const id = `feed_${uid()}`;

  const items = xmlDOM.querySelectorAll('item');
  const articles = [].map.call(items, (item) => {
    const articleTitle = item.querySelector('title');
    const articleLink = item.querySelector('link');
    const articleDescription = item.querySelector('description');
    return {
      title: articleTitle ? articleTitle.textContent : '',
      link: articleLink ? articleLink.textContent : '',
      description: articleDescription ? articleDescription.textContent : '',
    };
  });

  return {
    id,
    title: title ? title.textContent : '',
    description: description ? description.textContent : '',
    articles,
  };
};


const inputStorekeeper = (data) => {
  store.input = data;
};

const inputEmptyStorekeeper = () => {
  store.input = {
    isValid: true,
    value: '',
  };
};

const alertOpenStorekeeper = (data) => {
  store.error = data;
};

const alertCloseStorekeeper = () => {
  store.error = null;
};

const addFeedStorekeeper = (data) => {
  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'application/xml');
  const feed = getFeedData(xmlDOM);
  store.feeds = [...store.feeds, feed];
};

const modalOpenStorekeeper = (data) => {
  store.modal = data;
};

const modalCloseStorekeeper = () => {
  store.modal = {
    title: '',
    body: '',
  };
};

export default {
  inputPublisher: new Publisher({
    INPUT_CHANGE: inputStorekeeper,
    INPUT_EMPTY: inputEmptyStorekeeper,
  }),
  alertPublisher: new Publisher({
    ALERT_OPEN: alertOpenStorekeeper,
    ALERT_CLOSE: alertCloseStorekeeper,
  }),
  feedPublisher: new Publisher({ ADD_FEED: addFeedStorekeeper }),
  modalPublisher: new Publisher({
    MODAL_OPEN: modalOpenStorekeeper,
    MODAL_CLOSE: modalCloseStorekeeper,
  }),
};

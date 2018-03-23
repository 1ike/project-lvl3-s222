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


const inputValueStorekeeper = (data) => {
  store.input = data;
};

const alertStorekeeper = (data) => {
  store.error = data;
};

const addFeedStorekeeper = (data) => {
  console.log(data);
  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'application/xml');
  const feed = getFeedData(xmlDOM);
  store.feeds = [...store.feeds, feed];
};

const modalStorekeeper = (data) => {
  store.modal = data;
};

export default {
  inputValuePublisher: new Publisher(inputValueStorekeeper),
  alertPublisher: new Publisher(alertStorekeeper),
  addFeedPublisher: new Publisher(addFeedStorekeeper),
  modalPublisher: new Publisher(modalStorekeeper),
};

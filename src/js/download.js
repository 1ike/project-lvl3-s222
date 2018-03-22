import axios from 'axios';
import store from './store';
import publishers from './publishers';


const corsProxy = 'https://crossorigin.me/';

const { alertPublisher, addFeedPublisher, inputValuePublisher } = publishers;


const uid = (() => {
  let id = 0;
  return () => {
    const result = id === 0 ? 0 : id;
    id += 1;
    return result;
  };
})();

const getFeedData = (xmlDOM) => {
  const title = xmlDOM.querySelector('channel > title').textContent;
  const description = xmlDOM.querySelector('channel > description').textContent;
  const id = `feed_${uid()}`;

  const articles = [].map.call(xmlDOM.querySelectorAll('item'), (item) => {
    const articleTitle = item.querySelector('title').textContent;
    const articleLink = item.querySelector('link').textContent;
    const articleDescription = item.querySelector('description').textContent;
    return {
      title: articleTitle,
      link: articleLink,
      description: articleDescription,
    };
  });

  return {
    id, title, description, articles,
  };
};

export default (url, crossorigin = true) => {
  axios.get(crossorigin ? corsProxy + url : url)
    .then((response) => {
      const { data } = response;
      const parser = new DOMParser();
      const xmlDOM = parser.parseFromString(data, 'application/xml');
      const feed = getFeedData(xmlDOM);
      store.feeds = [...store.feeds, feed];
      store.error = null;
      inputValuePublisher.deliver();
      alertPublisher.deliver();
      addFeedPublisher.deliver(feed);
    })
    .catch((error) => {
      store.error = error;
      alertPublisher.deliver();
    });
};


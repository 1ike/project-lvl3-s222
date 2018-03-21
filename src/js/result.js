import $ from 'jquery';
import 'bootstrap';
import store from './store';

// const corsProxy = '';// 'https://crossorigin.me/';
const modalID = 'descriptionModal';
const $modal = $(`#${modalID}`);
$modal.on('hidden.bs.modal', () => {
  $modal.find('.modal-title').text('');
  $modal.find('.modal-body').text('');
});

const uid = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();

const renderAlert = (error) => {
  const alert = document.querySelector('.alert.alert-danger');

  if (error) {
    alert.innerHTML = error.message;
    alert.classList.remove('d-none');
    store.alert.active = true;
    store.alert.value = error.message;
  } else {
    alert.classList.add('d-none');
    alert.innerHTML = '';
    store.alert.active = false;
    store.alert.value = '';
  }
};

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
    button.dataset.target = `#${modalID}`;
    li.appendChild(a);
    li.appendChild(button);
    items.appendChild(li);
    button.addEventListener('click', () => {
      $modal.find('.modal-title').text(item.title);
      $modal.find('.modal-body').text(item.description);
    });
  });

  feedElem.appendChild(title);
  feedElem.appendChild(description);
  feedElem.appendChild(items);

  const container = document.getElementById('mainContainer');
  const firstItem = container.querySelector('.feed');
  container.insertBefore(feedElem, firstItem);
};

const clearInput = () => {
  const input = document.getElementById('urlInput');
  input.focus();
  input.value = '';
  store.form.value = '';
};


export default (result) => {
  const { data, error } = result;

  renderAlert(error);

  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'application/xml');
  // console.log(xmlDOM);

  const feed = getFeedData(xmlDOM);

  renderFeed(feed);


  store.feeds = [...store.feeds, feed];


  clearInput();

  return null;
};


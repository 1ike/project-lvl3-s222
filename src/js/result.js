// import axios from 'axios';


// const corsProxy = '';// 'https://crossorigin.me/';

// const check = (elem, value) => {

// };


export default (result) => {
  const { data, error } = result;

  const $alert = $('.alert.alert-danger');
  if (error) {
    $alert.html(error.message);
    $alert.removeClass('d-none');
    return null;
  }

  $alert.addClass('d-none');

  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'application/xml');
  console.log(xmlDOM);

  const feed = document.createElement('div');
  feed.classList.add('feed');

  const title = document.createElement('h2');
  title.innerHTML = xmlDOM.querySelector('channel > title').textContent;
  const description = document.createElement('p');
  description.innerHTML = xmlDOM.querySelector('channel > description').textContent;

  const items = document.createElement('ul');
  console.log(items);
  [].forEach.call(xmlDOM.querySelectorAll('item'), (item) => {
    console.log("item.querySelector('title').textContent");
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.innerHTML = item.querySelector('title').textContent;
    a.href = item.querySelector('link').textContent;
    li.appendChild(a);
    items.appendChild(li);
  });

  feed.appendChild(title);
  feed.appendChild(description);
  feed.appendChild(items);

  const container = document.getElementById('mainContainer');
  const firstItem = container.querySelector('.feed');
  container.insertBefore(feed, firstItem);
};



// const corsProxy = '';// 'https://crossorigin.me/';

// const check = (elem, value) => {

// };


export default (result) => {
  const { data, error } = result;

  const alert = document.querySelector('.alert.alert-danger');
  if (error) {
    alert.innerHTML = error.message;
    alert.classList.remove('d-none');
    return null;
  }

  alert.classList.add('d-none');

  const parser = new DOMParser();
  const xmlDOM = parser.parseFromString(data, 'application/xml');
  // console.log(xmlDOM);

  const feed = document.createElement('div');
  feed.classList.add('feed');

  const title = document.createElement('h2');
  title.innerHTML = xmlDOM.querySelector('channel > title').textContent;
  const description = document.createElement('p');
  description.innerHTML = xmlDOM.querySelector('channel > description').textContent;

  const items = document.createElement('ul');
  // console.log(items);
  [].forEach.call(xmlDOM.querySelectorAll('item'), (item) => {
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

  const input = document.getElementById('urlInput');
  input.focus();
  input.value = '';

  return null;
};


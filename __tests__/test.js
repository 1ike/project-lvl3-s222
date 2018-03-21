// import { Example } from '../src';
import fs from 'fs';
import path from 'path';
import { html } from 'js-beautify';
import timeout from 'timeout-then';
import axios from 'axios'; // eslint-disable-line
import httpAdapter from 'axios/lib/adapters/http'; // eslint-disable-line
import nock from 'nock'; // eslint-disable-line

import download from '../src/js/download';

axios.defaults.adapter = httpAdapter;

/* const getElems = () => {
  const form = document.getElementById('urlForm');
  const input = document.getElementById('urlInput');
  const button = form.querySelector('button');
  return { form, input, button };
}; */

const fixuturesPath = path.join(__dirname, '__fixtures__');
const host = 'http://lorem-rss.herokuapp.com';
const feedMinute = '/feed';
const feedYear = '/feed?unit=year';


beforeEach(() => {
  const initHtml = fs.readFileSync(path.join(fixuturesPath, 'init.html'), 'utf8');
  document.documentElement.innerHTML = initHtml;
});

test('feed', async () => {
  const expected = fs.readFileSync(path.join(fixuturesPath, 'result.html'), 'utf8');
  const xmlMinute = fs.readFileSync(path.join(fixuturesPath, 'minute.xml'), 'utf8');
  const xmlYear = fs.readFileSync(path.join(fixuturesPath, 'year.xml'), 'utf8');

  nock(host).get(feedMinute).reply(200, xmlMinute);
  download(host + feedMinute, false);
  await timeout(100);

  nock(host).get(feedYear).reply(200, xmlYear);
  download(host + feedYear, false);
  await timeout(100);

  expect(html(document.documentElement.innerHTML)).toEqual(html(expected));
});

/* test('modal', async () => {
  const xmlYear = fs.readFileSync(path.join(fixuturesPath, 'year.xml'), 'utf8');
  const modal = fs.readFileSync(path.join(fixuturesPath, 'modal.html'), 'utf8');
  const modalClose = fs.readFileSync(path.join(fixuturesPath, 'modal-close.html'), 'utf8');

  nock(host).get(feedYear).reply(200, xmlYear);
  download(host + feedYear, false);
  await timeout(100);

  const button = document.querySelector('a[href="http://example.com/test/1514764800"] ~ button');
  console.log(button);
  button.click();
  await timeout(1000);

  expect(html(document.documentElement.innerHTML)).toEqual(html(modal));

  const buttonClose = document.querySelector('#descriptionModal button');
  buttonClose.click();
  await timeout(1000);


  expect(html(document.documentElement.innerHTML)).toEqual(html(modalClose));
}); */

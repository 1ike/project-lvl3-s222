export default {
  formID: 'urlForm',
  inputID: 'urlInput',
  modalID: 'descriptionModal',
  feeds: [],
  urlsForDownload: {
    urls: [],
    isAdded: true,
  },
  input: {
    isValid: true,
    value: '',
  },
  error: null,
  modal: {
    title: '',
    body: '',
  },
  proxy: {
    proxyURL: 'https://crossorigin.me/',
    crossorigin: false,
  },
  regularUpdate: {
    delay: 5000,
    isEnabled: true,
  },
};


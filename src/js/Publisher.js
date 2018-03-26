export default class {
  subscribers = [];

  constructor(storekeepers) {
    this.storekeepers = storekeepers;
  }

  deliver(type, data) {
    this.storekeepers[type](data);
    this.subscribers.forEach((component) => {
      const dataFromStore = component.getData();
      component.handler(dataFromStore);
    });

    return this;
  }

  subscribe(subscriber) {
    this.subscribers = [...this.subscribers, subscriber];

    return this;
  }
}

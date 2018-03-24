export default class {
  subscribers = [];

  constructor(storekeepers) {
    this.storekeepers = storekeepers;
  }

  deliver(type, data) {
    // console.log(type);
    this.storekeepers[type](data);
    this.subscribers.forEach((component) => {
      const dataFromStore = component.getData();
      component.render(dataFromStore);
    });

    return this;
  }

  subscribe(subscriber) {
    this.subscribers = [...this.subscribers, subscriber];

    return this;
  }
}

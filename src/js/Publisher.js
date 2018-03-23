export default class {
  subscribers = [];

  constructor(storekeeper) {
    this.storekeeper = storekeeper;
  }

  deliver(data) {
    if (this.storekeeper) this.storekeeper(data);
    this.subscribers.forEach((fn) => {
      fn();
    });

    return this;
  }

  subscribe(subscriber) {
    this.subscribers = [...this.subscribers, subscriber];

    return this;
  }
}

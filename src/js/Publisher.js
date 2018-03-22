export default class {
  subscribers = [];

  deliver(data) {
    this.subscribers.forEach((fn) => {
      fn(data);
    });

    return this;
  }

  subscribe(subscriber) {
    this.subscribers = [...this.subscribers, subscriber];

    return this;
  }
}

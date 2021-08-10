class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
    this.prev = null;
  }
}

// Very basic and simple linked list for cards deck implementaion
class LinkedList {
  constructor() {
    this.head = null;
    this.last = null;
    this.size = 0;
  }

  add(element) {
    var node = new Node(element);
    if (this.size == 0) {
      this.head = node;
      this.last = node;
    } else {
      this.last.next = node;
      node.prev = this.last;
      this.last = node;
    }

    this.size++;
  }

  // remove head or last
  remove() {
    var removed;
    if (this.size == 0) return;
    if (this.size == 1) {
      removed = this.head;
      this.head = null;
      this.last = null;
    } else {
      removed = this.last;
      this.last = this.last.prev;
      this.last.next = null;
    }
    this.size--;
    return removed;
  }

  removePerIndex(index) {
    var removed;
    if (index >= this.size || index < 0) return;
    if (index == this.size - 1) {
      return this.remove();
    } else if (index == 0) {
      removed = this.head;
      this.head = this.head.next;
      this.head.prev = null;
    } else {
      var node = this.head;
      for (let i = 0; i < index; i++) {
        node = node.next;
      }
      node.prev.next = node.next;
      node.next.prev = node.prev;
      removed = node;
    }
    this.size--;
    return removed;
  }
}

module.exports.LinkedList = LinkedList;

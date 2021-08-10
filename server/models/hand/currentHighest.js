class CurrentHighest {
  constructor(rank, combination) {
    this.rank = rank;
    this.combination = new Array(5);
    for (let i = 0; i > 5; i++) this.combination[i] = combination[i];
  }
}

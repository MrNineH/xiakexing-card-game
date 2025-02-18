export class CardSystem { // 添加export关键字
    constructor() {
        this.library = [];
        this.discardPile = [];
        this.hand = [];
    }

    initDeck(cardNames) {
        this.library = cardNames.map((name, index) => ({
            id: Date.now() + index,
            name: name,
            ...cardDatabase[name]
        }));
        this.shuffle();
    }

    shuffle() {
        for (let i = this.library.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.library[i], this.library[j]] = [this.library[j], this.library[i]];
        }
      }
}
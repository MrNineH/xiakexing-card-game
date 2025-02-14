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
        this.library.sort(() => Math.random() - 0.5);
    }
}
const seed_winners = (max) => {
    const HOOFDPRIJS = 25000;
    const TROOSTPRIJS = 100;
    const map = new Map();

    const getRandomInt = () => {
        return Math.floor(Math.random() * max);
    }

    const getRandomPosition = () => {
        const x = getRandomInt();
        const y = getRandomInt();
        return `${x},${y}`;
    }

    const addwinner = (num) => {
        let key;
        do key = getRandomPosition();
        while (map.has(key));
        map.set(key, num);
    }

    // test
    map.set(`${25},${25}`, 10000);

    addwinner(HOOFDPRIJS);
    for (let i = 0; i < 100; i++)  addwinner(TROOSTPRIJS);
    return map;
}

module.exports = seed_winners;
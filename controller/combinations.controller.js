const db = require("../db");

function createCombinationItems(items) {
    const combinationItemsObject = items.reduce((aggr, value) => {
        const letter = String.fromCharCode(64 + value);
        if (!aggr[value]) {
            aggr[value] = []
        };
        const repeatingNumberCount = aggr[value].length + 1;
        aggr[value].push(`${letter}${repeatingNumberCount}`)
        return aggr
    }, {});

    return Object.values(combinationItemsObject).reduce((aggr, items) => [...aggr, ...items], []);
};

function generateCombinations(items, length) {
    const result = []
    let comb = []

    function chackCombinations(items, index) {
        if (items.length <= index) {
            comb = []
            return;
        }

        const letter = items[index].split('')[0];
        const letters = comb.map(item => item[0]);
        if (!letters.includes(letter)) comb.push(items[index]);

        if (comb.length === length) {
            result.push([...comb])
            comb.pop()
        };

        chackCombinations(items, +index + 1)
    }

    for (const index in items) {
        chackCombinations(items, index)
    }

    return result
};

const generate = async (req, res, next) => {
    try {
        const { items, length } = req.body;
        if (!Array.isArray(items) || typeof length !== "number") {
            return res.status(400).json({ message: 'Invalid input' });
        };

        const createItemSql = `INSERT INTO items (length,req_value,items_value) VALUES (?,?,?)`;
        const cretaeCombinationSql = `INSERT INTO combinations (combinations_value) VALUES (?)`;
        const cretaeResponsSql = `INSERT INTO responses (combination_id) VALUES (?)`;

        const combinationItems = createCombinationItems(items)

        await db.execute(createItemSql, [length, JSON.stringify(items), JSON.stringify(combinationItems)]);

        const combination = generateCombinations(combinationItems, length)

        const [resultCombination] = await db.execute(cretaeCombinationSql, [JSON.stringify(combination)]);

        await db.execute(cretaeResponsSql, [resultCombination.insertId]);

        res.status(200).json({
            id: resultCombination.insertId,
            combination
        })

    } catch (error) {
        next(error)
    }
}

module.exports = { generate }
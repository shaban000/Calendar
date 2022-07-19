const router = require('express').Router();
const calendar = require('../model/calendar');
const Calendar = require('../model/calendar');
const authenticateToken = require('../utils/auth');
const create_winners = require('../utils/create_winners');

const MAX = 100;

const startNewGame = async () => {
    await Calendar.updateMany({ active: true }, { active: false });
    return await new Calendar({
        winners: create_winners(MAX),
        guesses: new Map(),
        hasGuessed: new Map(),
        active: true
    }).save();
}

const getActiveCalendar = async () => {
    const calendar = await Calendar.findOne({ active: true });
    if (calendar != null) return calendar;
    return startNewGame();
}

const isValidNumber = input => {
    return input != null && typeof input === 'number' && input >= 0 && input < MAX;
}

const buildResponseData = (map) => {
    return Object.fromEntries(map);
}

router.get('/newGame', async (req, res) => {
    const calendar = await startNewGame();
    return res.status(200).json(calendar);
})

router.get('/data', async (req, res) => {
    const { guesses } = await getActiveCalendar();
    return res.status(200).json(buildResponseData(guesses));
})

router.post('/guess', authenticateToken, async (req, res) => {
    const { _id, guesses, winners, hasGuessed} = await getActiveCalendar();
    const { id } = req.user;
    const today = new Date();
  
    if (hasGuessed.has(id) && hasGuessed.get(id) === today.toDateString()){
        return res.status(400).send('You have already guessed today. Please come back tomorrow');
    }

    const { x, y } = req.body;
    if (!isValidNumber(x) || !isValidNumber(y)) return res.status(400).send('Invalid input.');
    
    const key = `${x},${y}`;
    if (guesses.has(key)) return res.status(400).send('Deze positie is al geraden door iemand.');
    
    const amount = winners.has(key) ? winners.get(key) : 0;
    guesses.set(key, { x: x, y: y, amount: amount, id: id });
    hasGuessed.set(id, today.toDateString());
    
    const response = await calendar.update({ _id:_id},{ guesses:guesses, hasGuessed:hasGuessed })
    if (response == null || response.modifiedCount == 0) return res.status(401).send("Opslaan van de data is niet gelukt.");
    return res.status(201).json(buildResponseData(guesses));
})

module.exports = router;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    winners: { type: Map, required: true },
    guesses: { type: Map, required: true },
    hasGuessed: { type: Map, required: true },
    active: { type: Boolean, required: true }
});

module.exports = mongoose.model('Calendar', schema);
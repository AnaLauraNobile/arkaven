const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GameSchema = new Schema({
    name: String,
});

module.exports = mongoose.model('Game', GameSchema);
var mongoose = require('mongoose');

var ZipSchema = mongoose.Schema({
	_id: String, 
	city: String,
	loc: { 
		type: [Number]
	},
	pop: Number,
	state: String });

// Set model to default mongodb instance
mongoose.model('Zip', ZipSchema);
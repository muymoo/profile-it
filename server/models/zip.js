var mongoose = require('mongoose');

var ZipSchema = mongoose.Schema({ 
	city: String,
	loc: [],
	pop: Number,
	state: String });

ZipSchema.index({ state:1 });

// Set model to default mongodb instance
mongoose.model('Zip', ZipSchema);
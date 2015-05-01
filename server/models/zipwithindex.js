var mongoose = require('mongoose');

var ZipSchemaWithIndex = mongoose.Schema({ 
	_id: String, 
	city: String,
	loc: [],
	pop: Number,
	state: String });

ZipSchemaWithIndex.index({ state:1 });

// Set model to default mongodb instance
mongoose.model('ZipWithIndex', ZipSchemaWithIndex);

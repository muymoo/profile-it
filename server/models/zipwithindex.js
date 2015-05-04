var mongoose = require('mongoose');

var ZipSchemaWithIndex = mongoose.Schema({ 
	_id: String, 
	city: String,
	loc: { 
		type: [Number], 
		index: { 
			type: '2dsphere', 
			sparse: true 
		}
	},
	pop: Number,
	state: String });

ZipSchemaWithIndex.index({ state:1 });

// Set model to default mongodb instance
mongoose.model('ZipWithIndex', ZipSchemaWithIndex);

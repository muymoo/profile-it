var mongoose = require('mongoose');

var RunSchema = mongoose.Schema({ 
	name: String,
	start: Number,
	duration: Number });

// Set model to default mongodb instance
mongoose.model('Run', RunSchema);
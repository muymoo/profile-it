var mongoose = require('mongoose');

var SystemProfileSchema = mongoose.Schema({ 
		op: String,
		nscannedObjects: Number,
		responseLength: Number,
		ns: String,
		millis: Number 
	},
	{
		collection: 'system.profile'
	}
);

// Set model to default mongodb instance
mongoose.model('SystemProfile', SystemProfileSchema);
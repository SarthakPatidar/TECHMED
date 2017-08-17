var mongoose = require('mongoose');

var doctorSchema = mongoose.Schema({
	uid: String,
	Name: String,
    otp: Number,
	Gender: {type: String, enum: ["M", "F"]},
	Location: String,
	Pos: String,
	Spcl: String,
    Deg: String,
    Exp: Number,
    Fee: Number,
    Clinics: [{
    	Name: String,
    	Address: String
    }],
    Contact: Number
},{ collection: 'doctor' })

module.exports = mongoose.model('Doctors', doctorSchema);
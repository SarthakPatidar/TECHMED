var mongoose = require('mongoose');

var patientSchema = mongoose.Schema({
	uid: String,
	Name: String,
	Blood: String,
    Weight: Number,
	Height: Number,
	BMI: Number,
	Blood_Pressure: Number,
	Gender: {type: String, enum: ["M", "F"]},
	Location: String,
	Dob: String,
	otp: Number
}, { collection: 'patients' });

module.exports = mongoose.model('Patients', patientSchema);
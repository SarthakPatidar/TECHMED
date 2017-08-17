var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
	doctor_id: String,
	patient_id: String,
	Pulse_Rate: Number,
	Disease: String,
    symptoms: String,
    Medicines: String,
	Date: {type: Date, default: Date.now()}
},{ collection: 'reports' })

module.exports = mongoose.model('Reports', reportSchema);
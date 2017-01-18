const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const conn = mongoose.createConnection("mongodb://10.86.32.207:27017/altiris");

const SMASchema = new Schema({
    "rownumber" : String,
    "PC Name" : String,
    "PC Domain" : String,
    "OS Name" : String,
    "Serial Number" : String,
    "Last Connected" : String,
    "Last Boot Up Time" : String,
    "IP Address" : String,
    "Primary User" : String,
    "User Domain" : String,
    "System Type" : String,
    "Computer Model" : String,
    "Encryption Status" : String,
    "Encryption Method" : String,
    "TPM Activated" : String,
    "IsManaged" : String,
    "Altiris Server" : String,
    "IE Version" : String,
    "Image Version" : String,
    "Image Install Date" : String,
    "Current OS Build" : String,
    "BIOS Version" : String,
    "Memory (GB)" : String,
    "CPU Count" : String,
    "C: Free Space (GB)" : String,
    "Created in Altiris" : String,
    "MAC Address" : String,
    "Warranty End Date" : String
}, { collection: 'computers', id: false, toObject: { getters: true } });

module.exports = conn.model('User', SMASchema)
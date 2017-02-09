const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//const conn = mongoose.createConnection("mongodb://10.86.32.207:27017/airwatch");

const InvoiceSchema = new Schema({
    Staff_Legal: String,
    Company: String,
    Country: String,
    Email: String,
    Enrolled: String,
    EnrolledDevicesCount: String
}, { collection: 'invoice', toObject: { getters: true } });

const UserSchema = new Schema({
    ContactNumber: String,
    Email: String,
    EnrolledDevicesCount: String,
    FirstName: String,
    Group: String,
    LastName: String,
    Status: String,
    LastScanned: String
}, { collection: 'users', toObject: { getters: true } });

const DeviceSchema = new Schema({
    Staff_Legal: String,
    LEGAL_AD: String,
    Company: String,
    Country: String,
    AcLineStatus: String,
    AssetNumber: String,
    ComplianceStatus: String,
    CompromisedStatus: String,
    DeviceFriendlyName: String,
    EasId: String,
    EnrollmentStatus: String,
    EnrollmentUserID: String,
    Imei: String,
    IsSupervised: String,
    LastComplianceCheckOn: String,
    LastCompromisedCheckOn: String,
    LastEnrolledOn: String,
    LastSeen: String,
    LocationGroupName: String,
    MacAddress: String,
    Model: String,
    OperatingSystem: String,
    Ownership: String,
    PhoneNumber: String,
    Platform: String,
    SerialNumber: String,
    Udid: String,
    UserEmailAddress: String,
    UserIdent: String,
    UserName: String,
    VirtualMemory: String,
    LastScanned: String,
    Policies: String
}, { collection: 'devices', toObject: { getters: true } });

module.exports.Invoice = mongoose.model('Invoice', InvoiceSchema)
module.exports.User = mongoose.model('User', UserSchema)
module.exports.Device = mongoose.model('Device', DeviceSchema)

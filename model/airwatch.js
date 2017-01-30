const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//const conn = mongoose.createConnection("mongodb://10.86.32.207:27017/airwatch");

const InvoiceSchema = new Schema({
    Staff_Legal: String,
    LEGAL_AD: String,
    Company: String,
    Country: String,
    Email: String,
    Employee_ID: String,
    Company_ID: String,
    Enrolled: String,
    EnrolledDevicesCount: String
}, { collection: 'invoice', toObject: { getters: true } });

const UserSchema = new Schema({
    ContactNumber: String,
    CustomAttribute1: String,
    Email: String,
    EmailUserName: String,
    EnrolledDevicesCount: String,
    EnrollmentUserID: String,
    ExternalId: String,
    FirstName: String,
    Group: String,
    LastName: String,
    LocationGroupId: String,
    MessageType: String,
    MobileNumber: String,
    Role: String,
    SecurityType: String,
    Status: String,
    UserName: String,
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

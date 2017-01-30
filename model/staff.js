var mongoose = require('mongoose');

var StaffSchema = new mongoose.Schema({
    Guid: Number,
    Description: String,
    NotesName: String,
    FirstName: String,
    MiddleName: String,
    LastName: String,
    LocalJobTitle: String,
    AdMail: {type: String, lowercase: true},
    GuidCompany: Number,
    CompanyFamCode: String,
    CompanyName: String,
    FamCodeLegalUnit: String,
    CostCenter: String,
    OperationalManager: String,
    GuidOperationalManager: Number,
    Department: String,
    Division: String,
    LocationCity: String,
    CompanyCountry: String,
    Unid:String,
    GuidEmployeeSubstitute:Number
}, {collection: 'staff'});

module.exports = mongoose.model('Staff', StaffSchema);
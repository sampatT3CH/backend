// /* ----------------- This File Gets Data for Admin ----------------- */
// /* ----------------- Created : 9-4-2021 by Prayag ----------------- */
// /* -------------------------------------------------- Requirements -------------------------------------------------- */
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const { Storage } = require('@google-cloud/storage');
// const moment = require('moment');
// /* ------------------------------------------------------------------------------------------------------------------ */

// /* -------------------------------------------------- Schemas -------------------------------------------------- */
// const AdminSchema = require("../../models/admin/login");
// const EasyLoanSchema = require("../../models/loan-request-schema");
// const HospitalSchema = require("../../models/hospitals/verified_hospitals_model");
// const RequestsSchema = require("../../models/requests-schema");
// const CorporateSchema = require("../../models/corporate");
// const RequestVaccinationSchema = require("../../models/requests-vaccination");
// const UsersSchema = require("../../models/users");
// const EstimationSchema = require("../../models/requests-estimation");
// const SurgerySchema = require("../../models/requests-surgery");
// const KycSchema = require("../../models/requests-kyc");
// const axios = require('axios');
// var connection  = require('../database/database.js');

// /* ------------------------------------------------------------------------------------------------------------------ */


// module.exports = {
//     // Check Admin User
//     // 10-4-2021 Prayag
//     GetUser: async (req, res) => {
//         try {
//             connection.query('SELECT * FROM users ORDER BY id desc',function(err,rows)     {
 
//                 if(err){
//                  req.flash('error', err); 
//                  res.render('list',{page_title:"Users - Node.js",data:''});   
//                 }else{
                    
//                     res.render('list',{page_title:"Users - Node.js",data:rows});
//                 }
                                    
//                  });
//         } catch (error) {
//             console.log(error);
//         }
//     },


// };

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
  database: "mydb"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT name, address FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

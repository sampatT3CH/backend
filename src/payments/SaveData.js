/* ----------------- This File Saves Data from Corporate ----------------- */
/* ----------------- Created : 29-7-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const fs = require('fs');
const bcrypt = require("bcryptjs");
const reader = require('xlsx');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const razorpay = new Razorpay({ key_id:process.env.RazorPay_KeyId, key_secret: process.env.RazorPay_KeySecret });
const SendEmail = require('../third_party/email');
const SendPaymentSMS = require('../third_party/payment_sms');
const SendPaymentWhatsapp = require('../third_party/whatsapp_payment');
var qs = require('qs');

var Blob = require('blob');
/* ------------------------------------------------------------------------------------------------------------------ */

/* -------------------------------------------------- Schemas -------------------------------------------------- */
const PaymentSchema = require("../models/payments");
const HospitalSchema = require("../models/new_hospitals");
const UsersSchema = require('../models/users');
const RequestEstimateSchema = require("../models/requests-estimation");
const RequestKYCSchema = require("../models/requests-kyc");
const EDeskSchema = require("../models/edesk");
const PreAuthSchema = require("../models/pre-auth");

var UserAgent = require('user-agents');
var userAgent = new UserAgent();
/* ------------------------------------------------------------------------------------------------------------------ */
const Pool=require("pg").Pool;
const pool=new Pool({
    user:"easy_admin",
    password:"EasyAspatal1212",
    database:"ea_hospital_dashboard",
    host:"easyaspataal-staging-instance-1.cbqgtf1hzzqq.ap-south-1.rds.amazonaws.com",
    port:5432
});

module.exports = {


    Bmplaadharpan: async (req, res) => {
      
        try {
            console.log(req.body);
            var data = JSON.stringify({
                
                "consent": "Y",
                "pan": `${req.body.pan}`
              });
              
              var config = {
                method: 'post',
                url: 'https://testapi.karza.in/v2/pan',
                headers: { 
                  'x-karza-key': '90ZvNuguxNh4IeNI', 
                  'Content-Type': 'application/json'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
            //  console.log(JSON.stringify(response.data.request_id));
             var stat = JSON.stringify(response.data.request_id);
            console.log(stat);
              })
              .catch(function (error) {
                console.log(error);
              });
              const result = {
                code: 200,
                status: true,
                message: `${stat}`
            }
            console.log(result);
            res.json(result);
       
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'error'
            }
            console.log(result);
            res.json(result);
        }
    },

    UpdateJiraStatusnew:  async (req, res) => {
      
        try {
            var { patient, claim} = req.body;
            var data = JSON.stringify({
                "body": `Rs.2499/- Payment done successfully by ${patient}`
              });
              
              var config = {
                method: 'post',
                url: 'https://easylos.atlassian.net/rest/api/2/issue/CLAIM-'+claim+'/comment',
                headers: {
                    'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw',
                    'Content-Type': 'application/json',
                    'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_69b978ebc2f668f2b05972eca1046d919fefe3eb_lin'
                },
                data : data
              };
              axios(config)
              .then(function (response) {
                console.log('success');
              })
              .catch(function (error) {
                console.log(error);
              });
       
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'error'
            }
            res.json(result);
        }
    },

    UpdateJiraStatus: async (req, res) => {
      
        try {
            console.log(req.body)
            var { patient, claim, amount} = req.body;
            var data = JSON.stringify({
                "body": `Rs.${amount}/- Payment done successfully by ${patient}`
              });
              
              var config = {
                method: 'post',
                url: 'https://easylos.atlassian.net/rest/api/2/issue/CLAIM-'+claim+'/comment',
                headers: {
                    'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw',
                    'Content-Type': 'application/json',
                    'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_69b978ebc2f668f2b05972eca1046d919fefe3eb_lin'
                },
                data : data
              };
              axios(config)
              .then(function (response) {
                console.log('success');
              })
              .catch(function (error) {
                console.log(error);
              });
       
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'error'
            }
            res.json(result);
        }
    },

    // Check Sales Admin User
    // 3-8-2021 Prayag
    InitiatePayment: async (req, res) => {
        // req.body.map(val => {
        //     console.log(val + 'val')
        // })
        // req.query.map(val1 => {
        //     console.log(val1 + 'val1')
        // })
        console.log(req.body.amount);
        console.log(req.body.HID);
        console.log(req.body.contact);
        await pool.query("INSERT INTO payment (hid,contact,amount) VALUES ($1,$2,$3)",[req.body.HID,req.body.contact,req.body.amount]);
        const payment_capture = 1;
        const amount = req.body.amount;
        const currency = 'INR';
        if (req.body.name === "EasyAspataal") {
            var options = {
                amount: amount * 100,
                currency,
                receipt: shortid.generate(),
                notes: {
                    Claim_no: req.body.claim,
                    Patient_name: req.body.patient
                },

                transfers: [
                    {
                        account: req.body.accountid,
                        amount: amount * 100,
                        currency: "INR",
                    }
                ]

            }
        } else {
            var options = {
                amount: amount * 100,
                currency,
                receipt: shortid.generate(),
                transfers: [
                    {
                        account: req.body.accountid,
                        amount: amount * 100,
                        currency: "INR",
                    }
                ]

            }
        }
        try {
            const response = await razorpay.orders.create(options);

            const HospitalData = await HospitalSchema.findOne({ HID: req.body.HID });

            const CheckUser = await UsersSchema.countDocuments({ mobile: req.body.contact });

            if (CheckUser == 0) {
                const CheckCorpUser = await UsersSchema.countDocuments({ cmobile: req.body.contact });
                if (CheckCorpUser == 0) {
                    const EmployeeID = await UsersSchema.aggregate([
                        { $sort: { '_id': -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                EID: 1.0,
                            }
                        },
                    ]);
                    var userid = EmployeeID[0].EID;
                    var eid = Number(userid.substring(2)) + 1;

                    //Update Relation in User
                    const relationArr = {
                        EID: 'EA' + eid,
                        relation: 'self',
                    };

                    const saveuser = new UsersSchema({
                        mobile: req.body.contact,
                        name: req.body.name,
                        email: req.body.email,
                        EID: 'EA' + eid,
                        relation: 'self',
                        otp_verified: true,
                        kyc_verified: false,
                        from: 'qr',
                        relations: relationArr,
                    });
                    var UserDetails = await saveuser.save();

                    // KYC Save
                    const newKYC = new RequestKYCSchema({
                        EID: 'EA' + eid,
                        from: 'qr',
                        status: 'pending',
                    });
                    await newKYC.save();
                    var feid = 'EA' + eid;
                }
                else {
                    var UserDetails = await UsersSchema.findOne({ cmobile: req.body.contact });
                    var feid = UserDetails.EID;
                }
            }
            else {
                var UserDetails = await UsersSchema.findOne({ mobile: req.body.contact });
                var feid = UserDetails.EID;
            }

            //Save EDesk                    
            const CheckDesk = await EDeskSchema.countDocuments({ EID: feid });
            if (CheckDesk == 0) {
                const edesk = new EDeskSchema({
                    EID: feid,
                    HID: req.body.HID,
                    requestInitiated: {
                        payment: true,
                    },
                    userId: UserDetails._id,
                    hospitalId: HospitalData._id,
                    from: 'qr'
                });
                await edesk.save();

                const result = {
                    code: 200,
                    status: true,
                    message: {
                        id: response.id,
                        currency: response.currency,
                        amount: response.amount,
                        EID: feid,
                    }
                }
                res.json(result);
            }
            else {
                EDeskSchema.updateOne({ EID: feid }, {
                    requestInitiated: {
                        payment: true,
                    },
                    from: 'qr',
                }, function (err, affected, resp) {
                    const result = {
                        code: 200,
                        status: true,
                        message: {
                            id: response.id,
                            currency: response.currency,
                            amount: response.amount,
                            EID: feid,
                        }
                    }
                    res.json(result);
                })
            }
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'error'
            }
            res.json(result);
            console.log(err)
        }
    },


    // Split Payment
    // 20-10-2021 Prayag
    SplitPayment: async (req, res) => {
        try {

            const { paymentid, reason, eid, HID, name, email, contact } = req.body;

            const CheckUser = await UsersSchema.countDocuments({ EID: eid });
            const HospitalData = await HospitalSchema.findOne({ HID: HID });

            const data = {
                "amount": req.body.amount * 100,
                "currency": "INR",
                "accept_partial": true,
                "customer": {
                    "name": req.body.name,
                    "contact": req.body.contact,
                    "email": req.body.email
                },
                "notify": {
                    "sms": true,
                    "email": true
                },
                "reminder_enable": true,
            }

            const baseUrl = "https://api.razorpay.com/v1/payment_links";
            let b64Str = Buffer.from(
                `${process.env.RazorPay_KeyId}:${process.env.RazorPay_KeySecret}`
            ).toString("base64");
            let postAxios = await axios({
                method: "post",
                url: baseUrl,
                data: data,
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Basic ${b64Str}`,
                },
            });

            if (CheckUser == 0) {
                const EmployeeID = await UsersSchema.aggregate([
                    { $sort: { '_id': -1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            EID: 1.0,
                        }
                    },
                ]);
                var userid = EmployeeID[0].EID;
                var feid = Number(userid.substring(2)) + 1;

                //Update Relation in User
                const relationArr = {
                    EID: 'EA' + feid,
                    relation: 'self',
                };

                const saveuser = new UsersSchema({
                    mobile: req.body.contact,
                    name: req.body.name,
                    email: req.body.email,
                    EID: 'EA' + feid,
                    relation: 'self',
                    otp_verified: true,
                    kyc_verified: false,
                    from: 'qr',
                    relations: relationArr,
                });
                var UserDetails = await saveuser.save();

                // KYC Save
                const newKYC = new RequestKYCSchema({
                    EID: 'EA' + feid,
                    from: 'qr',
                    status: 'pending',
                });
                await newKYC.save();
            }
            else {
                var UserDetails = await UsersSchema.findOne({ EID: eid });
            }

            // Payment Save
            const PaymentID = await PaymentSchema.aggregate([
                { $sort: { '_id': -1 } },
                { $limit: 1 },
                {
                    $project: {
                        paymentId: 1.0,
                    }
                },
            ]);
            var newpaymentid = PaymentID[0].paymentId;
            var pid = Number(newpaymentid.substring(2)) + 1;

            const newPayment = new PaymentSchema({
                EID: UserDetails.EID,
                HID: HID,
                paymentId: 'PY' + pid,
                amount: data.amount,
                userId: UserDetails._id,
                hospitalId: HospitalData._id,
            });
            await newPayment.save();

            //Save EDesk                    
            const CheckDesk = await EDeskSchema.countDocuments({ EID: UserDetails.EID });
            if (CheckDesk == 0) {
                const edesk = new EDeskSchema({
                    EID: UserDetails.EID,
                    HID: HID,
                    requestInitiated: {
                        payment: true,
                    },
                    userId: UserDetails._id,
                    hospitalId: HospitalData._id,
                    from: 'qr'
                });
                await edesk.save();

                const result = {
                    code: 200,
                    status: true,
                    message: postAxios.data.short_url
                }
                res.json(result);
            }
            else {
                EDeskSchema.updateOne({ EID: UserDetails.EID }, {
                    requestInitiated: {
                        payment: true,
                    },
                    from: 'qr',
                }, function (err, affected, resp) {
                    const result = {
                        code: 200,
                        status: true,
                        message: postAxios.data.short_url
                    }
                    res.json(result);
                })
            }
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'Something went wrong'
            }
            res.json(result);
            console.log(err)
        }
    },


    // Save Payment
    // 26-10-2021 Prayag
    SavePayment: async (req, res) => {
        try {
            const { amount, paymentid, orderid, signature, reason, eid, HID, contact, notification } = req.body;

            const UserData = await UsersSchema.findOne({ EID: eid });
            const HospitalData = await HospitalSchema.findOne({ HID: HID });

            // Payment Save
            const PaymentID = await PaymentSchema.aggregate([
                { $sort: { '_id': -1 } },
                { $limit: 1 },
                {
                    $project: {
                        paymentId: 1.0,
                    }
                },
            ]);
           
            var newpaymentid = PaymentID[0].paymentId;
           
            var pid = Number(newpaymentid.substring(2)) + 1;

            const newPayment = new PaymentSchema({
                EID: eid,
                HID: HID,
                paymentId: 'PY' + pid,
                amount: amount,
                reason: reason,
                order_id: orderid,
                userId: UserData._id,
                hospitalId: HospitalData._id,
                razorpayOrderId: orderid,
                razorpayPaymentId: paymentid,
                razorpaySignature: signature,
                from: 'qr',
                status: 'Complete',
            });
            await newPayment.save();

            //Send Whatsapp
            if (notification == true) {
                const WhatsappSend = await SendPaymentWhatsapp(contact, amount, paymentid);
            }

            //Send SMS
            const transaction = Math.floor(Math.random() * 1000000000);
            const smsSend = await SendPaymentSMS(Number(HospitalData.contact), Number(amount), transaction);

            // Send Email to Hospital
            const Subject = 'Patient Payment';
            const Message = 'Dear ' + HospitalData.name + ',<br /><br />A payment with below details has been successfully initiated.It will reflect in your account on T+1<br/><br/><div align="center" style="background-color: blue"> <div align="center"> <br /> <h3 style="color: white; font-size:22px; font-weight: bold">LIFEBOX TECHNOLOGIES PRIVATE LIMITED</h3></div> <br /> </div> </div> <div align="center"> <p style="font-size:30px"><b>₹' + amount + '<b/><br/><span style="font-size:16px">Initiated Succesfully</span> <hr style="width:70%" /></p> </div> <div align="center"> <div > <span style="font-size:16px" ><b style="font-size:18px" >Order Id</b> : ' + orderid + '</span> </div> <br /><div > <span style="font-size:16px" ><b style="font-size:18px" >Payment Id</b> : ' + paymentid + '</span> </div><br /><div > <span style="font-size:16px" ><b style="font-size:18px" >Name</b> : ' + UserData.name + '</span> </div> <br /><br /> </div> <br /><br /> <br /><br /><br /><br /> <div align="center"> <div> <hr style="width:70%" /> <span>For any order related queries, please reach out to LIFEBOX TECHNOLOGIES PRIVATE LIMITED .</span> </div> <br /> </div>';
            const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

            const result = {
                code: 200,
                status: true,
                message: 'Success'
            }
            res.json(result);

        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'Something went wrong'
            }
            res.json(result);
            console.log(err)
        }
    },




     //Qr  Payment sms
    
    SmsQrPayment: async (req, res) => {
        try {
          
            const { amount, contact, mobile, pan, aadhar } = req.body;

            
            var data = JSON.stringify({
              "fields": {
                "project": {
                  "key": "CLAIM"
                },
                "summary": "BNPL LEAD",
                "description": 'A new lead with below details has initiated paylater service \n pan_number:' + pan + '\n aadhar_number:' + aadhar,
                "issuetype": {
                  "name": "Bug"
                }
              }
            });
            
            var config = {
              method: 'post',
              url: 'https://sampat.atlassian.net/rest/api/2/issue',
              headers: { 
                'Authorization': 'Basic bXBza3VtYXIwNzVAZ21haWwuY29tOkJZenlvdzNxZm1UbmxYMmdkZXdCMjUyRA==', 
                'Content-Type': 'application/json', 
                'Cookie': 'atlassian.xsrf.token=b3a9ba08-28f4-40e6-a877-40dbd505a6c0_4b60ed132538ce745d685a4a0983124fe1130d3e_lin'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
            

            // Send SMS
            const transaction = Math.random() * 1000000000 ;
             await SendPaymentSMS(Number(contact), Number(amount), Number(Math.round(transaction)));
             await SendPaymentSMS(Number(mobile), Number(amount), Number(Math.round(transaction)));

         
            const result = {
                code: 200,
                status: true,
                message: 'Success'
            }
            res.json(result);

        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'Something went wrong'
            }
            res.json(result);
            console.log(err)
        }
    },



 // verification suite cashfree
 
 // Save Payment
    // 26-10-2021 Prayag
    VerifyPan: async (req, res) => {
        try {

            //pan
            console.log(req.body);
            const {  pan, aadhar } = req.body;
            var data = JSON.stringify({
              "pan": `${pan}`
            });
            
            var config = {
              method: 'post',
              url: 'https://api.cashfree.com/verification/pan',
              headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                // 'x-cf-signature': 'sampat', 
                'x-client-id': 'CF155874C854L25JDDO8UP2KG2K0', 
                'x-client-secret': 'f994b853582ad6d2859c5a52a5d38ed3d72fa5a8',
                'publicKey':'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2XIB1EcdXGM3e4jH2gi2 dxHJsnJWbau6qkpXSYxC/iwUlakHSAOCHYmWqk5KUoN9TW9H4QcQ8B32br84V1NJ FxgMw8oP6f41GiW7TfjaonGMbXlws2po61lUgOfC6kqI9VGl+5dAlU2KQKyvrGDR XOl+m/StVVkKh3/Sl3OtOEt4vJzda+e3ZMy4m0he3U0BcSRbfgC2C2LIEcttgAWL TTFdjT9Cph8mGbHeh0Xq1B0zkUG+x4hpYrFRHIxWPcFTUsEs62bozuLwoNA3x7JL OKz9jGyKBgB6Kd8jjM1vC2q+sDNe6S1909zTICwzFPFW/WjIBwozsFXGip9c05XC rwIDAQAB',
              },
              data : data
            };
            // aadhar

        
// var dataaadhar = JSON.stringify({
//   "aadhaarNumber": `${aadhar}`
// });

// var configuration = {
//   method: 'post',
//   url: 'https://api.cashfree.com/verification/aadhaar',
//   headers: { 
//     'Accept': 'application/json', 
//     'Content-Type': 'application/json', 
//     'x-cf-signature': 'sampat', 
//     'x-client-id': 'CF155874C854L25JDDO8UP2KG2K0', 
//     'x-client-secret': 'f994b853582ad6d2859c5a52a5d38ed3d72fa5a8',
//     'pathToPublicKey':'C:\Users\MY_PC\Downloads\public-key.zip\accountId_10843_public_key.pem',
//   },
//   dataaadhar : dataaadhar
// };
            axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            //   console.log(JSON.stringify(response.dataaadhar));
              
            })
            .catch(function (error) {
              console.log(error);
            });

//             axios(configuration)
//             .then(function (response) {
         
//               console.log(JSON.stringify(response.dataaadhar));
//             })
//             .catch(function (error) {
//               console.log(error);
//             });
            

            const result = {
                code: 200,
                status: true,
                message: JSON.stringify(response.data)
            }
            res.json(result);

        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'Something went wrong'
            }
            res.json(result);
            console.log(err)
        }
    },



    

};



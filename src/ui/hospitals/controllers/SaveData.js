/* ----------------- This File Saves Request from Homepage ----------------- */
/* ----------------- Created : 27-4-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const moment = require('moment');
const { google } = require('googleapis');
const SendSMS = require('../../../third_party/sms');
const SendEmail = require('../../../third_party/email');
/* -------------------------------------------------- Requirements -------------------------------------------------- */


/* -------------------------------------------------- Sending Email Credentials -------------------------------------------------- */
const CLIENT_ID = '168438088579-d77o04co2nb75sbgqf8lmc1jh01aaiki.apps.googleusercontent.com';
const CLEINT_SECRET = 'Uq2NNmcKr6uR1LyCZ-zvK4r3';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04cQGDkJNePgMCgYIARAAGAQSNwF-L9Ir7VTRMwbgzqwq2-5nuL-sQNDSlBKhNekIqgBHvvR743sAX6BeTOU5UpmcTrbTGJGTjQs';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
/* -------------------------------------------------- Sending Email Credentials -------------------------------------------------- */



/* -------------------------------------------------- Schemas -------------------------------------------------- */
const UsersSchema = require('../../../models/users');
const RequestEstimateSchema = require("../../../models/requests-estimation");
const RequestKYCSchema = require("../../../models/requests-kyc");
const EDeskSchema = require("../../../models/edesk");
const PreAuthSchema = require("../../../models/pre-auth");
const PaymentSchema = require("../../../models/payments");
const HospitalSchema = require("../../../models/new_hospitals");
/* ------------------------------------------------------------------------------------------------------------------ */

module.exports = {

    // Register User
    // 7-9-2021 Prayag
    RegisterUser: async (req, res) => {
        try {
            const { name, email, address, eid, age, HID, reason } = req.body;

            const HospitalData = await HospitalSchema.findOne({ HID: HID });
            const UsersData = await UsersSchema.findOne({ EID: eid });
            

            //Update Users
            await UsersSchema.updateOne({ EID: eid }, {
                name: name,
                age: age,
                email: email,
                address_line1: address,
                from: 'qr',
            }, async function (err, affected, resp) {
                //Save E-Desk
                const CheckEDesk = await EDeskSchema.countDocuments({ EID: eid });
                if (CheckEDesk == 0) {
                    const edesk = new EDeskSchema({
                        userId: UsersData._id,
                        hospitalId: HospitalData._id,
                        EID: eid,
                        HID: HID,
                        from: 'qr'
                    });
                    const savedEDeskDetails = await edesk.save();
                }
                // Send Email to Hospital
                const Subject = 'Patient Onboard';
                const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has been successfully E-registered with your hospital \n \n Name: ' + name + '\nPurpose: ' + reason + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

                const result = {
                    code: 200,
                    status: true,
                    message: 'User saved successfully'
                }
                res.json(result);
            })
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error
            }
            res.json(result);
            console.log(error);
        }
    },


     // Easy Finance
    // 7-9-2021 Prayag
    EasyFinance: async (req, res) => {
        try {

            const { name, email, address, eid, age, HID, surgery, cost, city, insurance, pan, aadharno, aadharimg } = req.body;

            const HospitalData=await pool.query("SELECT hid FROM hospital WHERE hid=$1",[HID]);
            const UsersData = await pool.query("SELECT eid FROM userspf WHERE eid=$1",[eid])

            // const HospitalData = await HospitalSchema.findOne({ HID: HID });
            // const UsersData = await UsersSchema.findOne({ EID: eid });


            await pool.query(("UPDATE userspf SET (name,age,email,from_source) VALUES ($1,$2,$3,$4)",[name,age,email,'qr']),

            // await UsersSchema.updateOne({ EID: eid }, {
            //     name: name,
            //     age: age,
            //     email: email,
            //     from: 'qr',
            // }, 
            async function (err, affected, resp) {
                // Save Estimate

                
                const saveestimate = await pool.query("INSERT INTO requestestimation (eid,treatment,budget,finance,insurance,city,status,from) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",[eid,surgery,cost,true,insurance,city,'pending','qr'])
                // const saveestimate = new RequestEstimateSchema({
                //     EID: eid,
                //     treatment: surgery,
                //     budget: cost,
                //     finance: true,
                //     insurance: insurance,
                //     city: city,
                //     status: 'pending',
                //     from: 'qr'
                // });
                // await saveestimate.save();

                //Save EDesk                    
                // const CheckEDesk = await EDeskSchema.countDocuments({ EID: eid });
                const CheckEDesk = await pool.query("SELECT eid FROM edesk WHERE eid=$1",[eid])
                if (CheckEDesk > 0) {
                    const requestInitiated = {finance:true}
                    await pool.query(("UPDATE edesk SET (eid,request_initiated) VALUES ($1,$2)"[eid,requestInitiated]),
                    // EDeskSchema.updateOne({ EID: eid }, {
                    //     requestInitiated: {
                    //         finance: true,
                    //     },
                    // },
                     async function (err, affected, resp) {
                        // Send Email to Hospital
                        // const Subject = 'Patient Onboard';
                        // const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Easy Finance with your hospital \n \n Name: ' + name + '\nEmail: ' + email + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                        // const EmailSend = await SendEmail(HospitalData.email, Subject, Message);
                     await pool.query(("UPDATE requestkyc SET (eid,pan,aadhar_no,others,status,from_source) VALUES",[pan,aadharno,[aadharimg],'in_process','ui']),
                        // RequestKYCSchema.updateOne({ EID: eid }, {
                        //     pan: pan,
                        //     aadhar_no: aadharno,
                        //     aadhar_img: aadharimg,
                        //     status: 'in_process',
                        //     from: 'ui',
                        // }, 
                        function (err, affected, resp) {
                            const result = {
                                code: 200,
                                status: true,
                                message: 'Details saved successfully'
                            }
                            res.json(result);
                        })
                    })
                }
                else {
                    const requestInitiated = {
                        finance: true,
                    }
                    const edesk = await pool.query("INSERT INTO edesk (eid,hid,from_source,request_initiated) VALUES ($1,$2,$3,$4)",[eid,HID,'qr',requestInitiated])
                    // const edesk = new EDeskSchema({
                    //     userId: UsersData._id,
                    //     hospitalId: HospitalData._id,
                    //     requestInitiated: {
                    //         finance: true,
                    //     },
                    //     EID: eid,
                    //     HID: HID,
                    //     from: 'qr'
                    // });
                    // await edesk.save();
                }

                // Send Email to Hospital
                // const Subject = 'Patient Onboard';
                // const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Easy Finance with your hospital \n \n Name: ' + name + '\nEmail: ' + email + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                // const EmailSend = await SendEmail(HospitalData.email, Subject, Message);
                await pool.query(("UPDATE requestkyc SET (pan,aadhar_no,status,from_source) VALUES",[pan,aadharno,'in_process','ui']),
                // RequestKYCSchema.updateOne({ EID: eid }, {
                //     pan: pan,
                //     aadhar_no: aadharno,
                //     status: 'in_process',
                //     from: 'ui',
                // },
                 function (err, affected, resp) {
                    const result = {
                        code: 200,
                        status: true,
                        message: 'Details saved successfully'
                    }
                    res.json(result);
                })
            })
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error
            }
            res.json(result);
            console.log(error);
        }
    },



    // Easy Finance
    // 7-9-2021 Prayag
    // EasyFinance: async (req, res) => {
    //     try {

    //         const { name, email, address, eid, age, HID, surgery, cost, city, insurance, pan, aadharno, aadharimg } = req.body;

    //         const HospitalData = await HospitalSchema.findOne({ HID: HID });
    //         const UsersData = await UsersSchema.findOne({ EID: eid });

    //         await UsersSchema.updateOne({ EID: eid }, {
    //             name: name,
    //             age: age,
    //             email: email,
    //             from: 'qr',
    //         }, async function (err, affected, resp) {
    //             // Save Estimate
    //             const saveestimate = new RequestEstimateSchema({
    //                 EID: eid,
    //                 treatment: surgery,
    //                 budget: cost,
    //                 finance: true,
    //                 insurance: insurance,
    //                 city: city,
    //                 status: 'pending',
    //                 from: 'qr'
    //             });
    //             await saveestimate.save();

    //             //Save EDesk                    
    //             const CheckEDesk = await EDeskSchema.countDocuments({ EID: eid });
    //             if (CheckEDesk > 0) {
    //                 EDeskSchema.updateOne({ EID: eid }, {
    //                     requestInitiated: {
    //                         finance: true,
    //                     },
    //                 }, async function (err, affected, resp) {
    //                     // Send Email to Hospital
    //                     const Subject = 'Patient Onboard';
    //                     const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Easy Finance with your hospital \n \n Name: ' + name + '\nEmail: ' + email + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
    //                     const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

    //                     RequestKYCSchema.updateOne({ EID: eid }, {
    //                         pan: pan,
    //                         aadhar_no: aadharno,
    //                         aadhar_img: aadharimg,
    //                         status: 'in_process',
    //                         from: 'ui',
    //                     }, function (err, affected, resp) {
    //                         const result = {
    //                             code: 200,
    //                             status: true,
    //                             message: 'Details saved successfully'
    //                         }
    //                         res.json(result);
    //                     })
    //                 })
    //             }
    //             else {
    //                 const edesk = new EDeskSchema({
    //                     userId: UsersData._id,
    //                     hospitalId: HospitalData._id,
    //                     requestInitiated: {
    //                         finance: true,
    //                     },
    //                     EID: eid,
    //                     HID: HID,
    //                     from: 'qr'
    //                 });
    //                 await edesk.save();
    //             }

    //             // Send Email to Hospital
    //             const Subject = 'Patient Onboard';
    //             const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Easy Finance with your hospital \n \n Name: ' + name + '\nEmail: ' + email + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
    //             const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

    //             RequestKYCSchema.updateOne({ EID: eid }, {
    //                 pan: pan,
    //                 aadhar_no: aadharno,
    //                 status: 'in_process',
    //                 from: 'ui',
    //             }, function (err, affected, resp) {
    //                 const result = {
    //                     code: 200,
    //                     status: true,
    //                     message: 'Details saved successfully'
    //                 }
    //                 res.json(result);
    //             })
    //         })
    //     } catch (error) {
    //         const result = {
    //             code: 400,
    //             status: false,
    //             message: error
    //         }
    //         res.json(result);
    //         console.log(error);
    //     }
    // },



    // Save PreAuth
    // 7-9-2021 Prayag

    SavePreAuth: async (req, res) => {
        try {

            const { name, aadharno, eid, insuranceNo, insuranceName, insured, HID, insuranceimg } = req.body;

            const HospitalData = await pool.query("SELECT hid FROM hospital WHERE hid=$1",[HID]);
            const UserData = await pool.query("SELECT eid FROM hospital WHERE eid=$1",[EID]);

            // const HospitalData = await HospitalSchema.findOne({ HID: HID });
            // const UsersData = await UsersSchema.findOne({ EID: eid });

            //Update Profile
            await pool.query(("UPDATE userspf SET (eid, name, from_source) VALUE ($1,$2,$3)",[eid,name,'qr']),

            // await UsersSchema.updateOne({ EID: eid }, {
            //     name: name,
            //     from: 'qr',
            // },
             async function (err, affected, resp) {
                //Update KYC
                await pool.query(("UPDATE requestkyc SET (eid, aadhar_no, status, from_source) VALUE ($1,$2,$3,$4)",[eid,aadharno,'in_process','qr']),
                // await RequestKYCSchema.updateOne({ EID: eid }, {
                //     aadhar_no: aadharno,
                //     status: 'in_process',
                //     from: 'qr',
                // },
                 async function (err, affected, resp) {
                    //Save PreAuth
                    const HospitalID=await pool.query("SELECT hid FROM hospital ORDER BY created_date DESC LIMIT 1 ");
                    var hospitalid = HospitalID.rows[0]["hid"];
                    var hospid = Number(hospitalid.substring(2)) + 1;

                    const PreAuthID=await pool.query("SELECT PID FROM preauth ORDER BY created_date DESC LIMIT 1");
                    const preauthid=PreAuthID.rows[0]["pid"];
                    var pid = Number(preauthid.substring(2)) + 1;
                    // const PreAuthIDNo = await PreAuthSchema.aggregate([
                    //     { $sort: { '_id': -1 } },
                    //     { $limit: 1 },
                    //     {
                    //         $project: {
                    //             PID: 1.0,
                    //         }
                    //     },
                    // ]);
                    // var preauthid = PreAuthIDNo[0].PID;
                    // var pid = Number(preauthid.substring(2)) + 1;

                    const savepreauth = await pool.query("INSERT INTO preauth (pid,hid,eid,insured_card_number,others,from_source ) VALUES ($1,$2,$3,$4,$5,$6)",['PA100005',HID,eid,insuranceNo,insuranceName])

                    // const savepreauth = new PreAuthSchema({
                    //     PID: 'PA100005',
                    //     HID: HID,
                    //     EID: eid,
                    //     userId: UsersData._id,
                    //     insuredCardIdNumber: insuranceNo,
                    //     insurer: insuranceName,
                    //     insurance_img: insuranceimg,
                    //     from: 'qr',
                    // });
                    // await savepreauth.save();

                    //Save EDesk
                    const requestInitiated  = {pre_auth: true}
                    const edesk = await pool.query("INSERT INTO edesk (eid,hid,request_initiated,from) VALUES ($1,$2,$3,$4)",[eid,HID,requestInitiated,'qr'])
                    
                    // const edesk = new EDeskSchema({
                    //     EID: eid,
                    //     HID: HID,
                    //     requestInitiated: {
                    //         pre_auth: true,
                    //     },
                    //     userId: UsersData._id,
                    //     hospitalId: HospitalData._id,
                    //     from: 'qr'
                    // });
                    // await edesk.save();

                    // Send Email to Hospital
                    const Subject = 'Patient Onboard';
                    const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Pre-Auth with your hospital \n \n Name: ' + name + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                    const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

                    const result = {
                        code: 200,
                        status: true,
                        message: 'Details saved successfully'
                    }
                    res.json(result);
                })
            })
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error
            }
            res.json(result);
            console.log(error);
        }
    },





    // SavePreAuth: async (req, res) => {
    //     try {

    //         const { name, aadharno, eid, insuranceNo, insuranceName, insured, HID, insuranceimg } = req.body;

    //         const HospitalData = await HospitalSchema.findOne({ HID: HID });
    //         const UsersData = await UsersSchema.findOne({ EID: eid });

    //         //Update Profile
    //         await UsersSchema.updateOne({ EID: eid }, {
    //             name: name,
    //             from: 'qr',
    //         }, async function (err, affected, resp) {
    //             //Update KYC
    //             await RequestKYCSchema.updateOne({ EID: eid }, {
    //                 aadhar_no: aadharno,
    //                 status: 'in_process',
    //                 from: 'qr',
    //             }, async function (err, affected, resp) {
    //                 //Save PreAuth
    //                 const PreAuthIDNo = await PreAuthSchema.aggregate([
    //                     { $sort: { '_id': -1 } },
    //                     { $limit: 1 },
    //                     {
    //                         $project: {
    //                             PID: 1.0,
    //                         }
    //                     },
    //                 ]);
    //                 var preauthid = PreAuthIDNo[0].PID;
    //                 var pid = Number(preauthid.substring(2)) + 1;

    //                 const savepreauth = new PreAuthSchema({
    //                     PID: 'PA100005',
    //                     HID: HID,
    //                     EID: eid,
    //                     userId: UsersData._id,
    //                     insuredCardIdNumber: insuranceNo,
    //                     insurer: insuranceName,
    //                     insurance_img: insuranceimg,
    //                     from: 'qr',
    //                 });
    //                 await savepreauth.save();

    //                 //Save EDesk                    
    //                 const edesk = new EDeskSchema({
    //                     EID: eid,
    //                     HID: HID,
    //                     requestInitiated: {
    //                         pre_auth: true,
    //                     },
    //                     userId: UsersData._id,
    //                     hospitalId: HospitalData._id,
    //                     from: 'qr'
    //                 });
    //                 await edesk.save();

    //                 // Send Email to Hospital
    //                 const Subject = 'Patient Onboard';
    //                 const Message = 'Dear ' + HospitalData.name + ',\n\n Patient with below details has requested for Pre-Auth with your hospital \n \n Name: ' + name + '\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
    //                 const EmailSend = await SendEmail(HospitalData.email, Subject, Message);

    //                 const result = {
    //                     code: 200,
    //                     status: true,
    //                     message: 'Details saved successfully'
    //                 }
    //                 res.json(result);
    //             })
    //         })
    //     } catch (error) {
    //         const result = {
    //             code: 400,
    //             status: false,
    //             message: error
    //         }
    //         res.json(result);
    //         console.log(error);
    //     }
    // },



    


    // Send OTP SMS
    // 7-9-2021 Prayag
    SendOTP: async (req, res) => {
        try {
            const { mobile, otp } = req.body;

            const CheckUser=await pool.query("SELECT mobile FROM userspf WHERE mobile=$1",[mobile])
            // console.log("CheckUser"+CheckUser.rows);
            
            if (CheckUser.rows==0) {
                
                const CheckCorpUser=await pool.query("SELECT cmobile FROM userspf WHERE cmobile=$1",[mobile])
                // console.log(CheckCorpUser.rows);
                
                
                if (CheckCorpUser.rows==0) {
                    //Send OTP
                    const smsSend = await SendSMS(otp, mobile);

                    //Add User
                    const EmployeeID=await pool.query("SELECT eid FROM userspf ORDER BY created_date DESC LIMIT 1");
                    var userid = EmployeeID.rows[0]["eid"];
                    // console.log("userid"+userid);
                    var eidd = Number(userid.substring(2)) + 1;
                    var eid="EA"+eidd;
                    console.log(eid);

                    //Update Relation in User
                    const relationArr = {
                        EID: eid,
                        relation: 'self'
                    };
                    var rel="self"

                    const newUser=await pool.query("INSERT INTO userspf (mobile,eid,relation,otp_verified,kyc_verified,relations) VALUES ($1,$2,$3,$4,$5,$6)",[mobile,eid,rel,true,false,relationArr]);


                    // KYC Save

                    // const newKYC=await pool.query("INSERT INTO RequestKYC (EID,from,status) VALUES ($1,$2,$3)",[eid,'qr','pending']);
                    
                    const result = {
                        code: 200,
                        status: true,
                        message: {
                            type: 'new',
                            UserData: eid,
                        }
                    }
                    res.json(result);
                }
                else {
                    const result = {
                        code: 200,
                        status: true,
                        message: {
                            type: 'exist',
                            UserData: eid,
                        }
                    }
                    res.json(result);
                }
            }

            else {
                const result = {
                    code: 200,
                    status: true,
                    message: {
                        type: 'exist',
                        UserData: eid,
                    }
                }
                res.json(result);
            }
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error
            }
            res.json(result);
            console.log(error);
        }
    },


    DasboardJiraList: async (req, res) => {
      
        try {
         
            var reporterId = req.query.reporterId   

var config = {
  method: 'get',
  url: 'http://easylos.atlassian.net/rest/api/2/search?jql=reporter='+`'${reporterId}'`,
  headers: { 
    'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw'
  }
};

axios(config)
.then(function (response) {
  
    var keyarr = [];
    var statusarr = [];
    var summaryarr = [];
    var createdarr = [];
    response.data.issues.map((issue, index) => {
  
 const keyresult = issue.key;
 keyarr.push(keyresult)

 const statusresult = issue.fields.status.name;
 statusarr.push(statusresult);


 const summaryresult = issue.fields.summary;
 summaryarr.push(summaryresult);

 const createdresult = new Date(Date.parse(issue.fields.created)).toLocaleString().replace(","," ");
 createdarr.push(createdresult)

    })
  

var items = keyarr.map((keyarr, index) => {
    return {
      key: keyarr,
      status: statusarr[index],
      summary: summaryarr[index],
      created: createdarr[index], 
    }
  });

    const result = {
    code: 200,
    status: true,
    message:items
}

res.json(result);
  
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



 //View Reporter List
 ViewReporterList: async (req, res) => {
      
    try {
        var claimNo = req.query.claimNo 
        console.log(req.query.claimNo)
        var config = {
            method: 'get',
            // url: 'https://easylos.atlassian.net/rest/api/3/issue/'+`${claimNo}`,
            url: 'https://easylos.atlassian.net/rest/api/3/issue/'+`${claimNo}`,
            headers: { 
              'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw', 
              'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_58b871a951e71de458a51cdbf179fadbb4451616_lin'
            }
          };
          
          axios(config)
          .then(function (response) {
              var statearr = [];
              var policyholdernamearr = [];
              var patientnamearr = [];
              var pinarr = [];
              var aadhararr = [];
              var approvalamountarr = [];
              var cityarr = [];
              var panarr = [];
              var contactarr = [];
              var dobarr = [];
              var agreementstatusarr = [];
              var paymentstatusarr = [];

            //Policy holder name
            policyholdernamearr.push(response.data.fields.customfield_10041)
            //patient name
            patientnamearr.push(response.data.fields.customfield_10040)
            //state
            statearr.push(response.data.fields.customfield_10190)
            //final approval amount
            approvalamountarr.push(response.data.fields.customfield_10180)
            //city
            cityarr.push(response.data.fields.customfield_10189)
            //pan
            panarr.push(response.data.fields.customfield_10057)
            //contact
            contactarr.push(response.data.fields.customfield_10107)
            //pincode
            pinarr.push(response.data.fields.customfield_10231)
            //aadhar
            aadhararr.push(response.data.fields.customfield_10104)
            //dob
            dobarr.push(response.data.fields.customfield_10103)
            //agreement status
            if(response.data.fields.customfield_10339 == null){
                agreementstatusarr.push('Not Updated')
              }
              else{
                agreementstatusarr.push(response.data.fields.customfield_10339.value)
              }
              //599 status
              if(response.data.fields.customfield_10345 == null){
                paymentstatusarr.push('Not Updated')
              }
              else{
                paymentstatusarr.push(response.data.fields.customfield_10345.value)
              }




           var items = statearr.map((statearr, index) => {
            return {
              state: statearr,
              city: cityarr[index], 
              pan: panarr[index],
              contact: contactarr[index],
              policyholdername: policyholdernamearr[index],
              patientname: patientnamearr[index],
              approvalamount: approvalamountarr[index],
              pin: pinarr[index],
              dob: dobarr[index],
              aadhar: aadhararr[index],
              agreementstatus: agreementstatusarr[index],
              paymentstatus: paymentstatusarr[index]
            }
          });
        
            const result = {
            code: 200,
            status: true,
            message:items
        }
        console.log(result)
        res.json(result);
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




    // SendOTP: async (req, res) => {
    //     try {
    //         const { mobile, otp } = req.body;

    //         const CheckUser = await UsersSchema.countDocuments({ mobile: mobile });

    //         if (CheckUser == 0) {

    //             const CheckCorpUser = await UsersSchema.countDocuments({ cmobile: mobile });

    //             if (CheckCorpUser == 0) {
    //                 //Send OTP
    //                 const smsSend = await SendSMS(otp, mobile);

    //                 //Add User
    //                 const EmployeeID = await UsersSchema.aggregate([
    //                     { $sort: { '_id': -1 } },
    //                     { $limit: 1 },
    //                     {
    //                         $project: {
    //                             EID: 1.0,
    //                         }
    //                     },
    //                 ]);
    //                 var userid = EmployeeID[0].EID;
    //                 var eid = Number(userid.substring(2)) + 1;

    //                 //Update Relation in User
    //                 const relationArr = {
    //                     EID: 'EA' + eid,
    //                     relation: 'self',
    //                 };

    //                 const saveuser = new UsersSchema({
    //                     mobile: mobile,
    //                     EID: 'EA' + eid,
    //                     relation: 'self',
    //                     otp_verified: true,
    //                     kyc_verified: false,
    //                     from: 'qr',
    //                     relations: relationArr,
    //                 });
    //                 const UserDetails = await saveuser.save();

    //                 // KYC Save
    //                 const newKYC = new RequestKYCSchema({
    //                     EID: 'EA' + eid,
    //                     from: 'qr',
    //                     status: 'pending',
    //                 });
    //                 await newKYC.save();

    //                 const result = {
    //                     code: 200,
    //                     status: true,
    //                     message: {
    //                         type: 'new',
    //                         UserData: 'EA' + eid,
    //                     }
    //                 }
    //                 res.json(result);
    //             }
    //             else {
    //                 const UserData = await UsersSchema.findOne({ cmobile: mobile });
    //                 const result = {
    //                     code: 200,
    //                     status: true,
    //                     message: {
    //                         type: 'exist',
    //                         UserData: UserData,
    //                     }
    //                 }
    //                 res.json(result);
    //             }
    //         }
    //         else {
    //             const UserData = await UsersSchema.findOne({ mobile: mobile });
    //             const result = {
    //                 code: 200,
    //                 status: true,
    //                 message: {
    //                     type: 'exist',
    //                     UserData: UserData,
    //                 }
    //             }
    //             res.json(result);
    //         }
    //     } catch (error) {
    //         const result = {
    //             code: 400,
    //             status: false,
    //             message: error
    //         }
    //         res.json(result);
    //         console.log(error);
    //     }
    // },



};

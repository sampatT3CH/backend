/* ----------------- This File Saves Data from Admin ----------------- */
/* ----------------- Created : 9-4-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const fs = require('fs');
const reader = require('xlsx');
const bcrypt = require("bcryptjs");
const { google } = require('googleapis');
const passwordgen = require("../helpers/password_gen");
const { Storage } = require('@google-cloud/storage');
const SendSMS = require('../../third_party/sms');
const OtpEmail = require('../../third_party/email');
const EasyLoanSchema = require("../../models/loan-request-schema");
const verified_hospitals_schema = require("../../models/hospitals/verified_hospitals_model");
const CitiesSchema = require("../../models/cities/city_model");
const RequestVaccinationSchema = require("../../models/requests-vaccination");
const UsersSchema = require("../../models/users");
const HospitalSchema = require("../../models/new_hospitals");
var html_to_pdf = require('html-pdf-node');
const axios = require('axios');
const TestToken = require('../../third_party/token');

/* ------------------------------------------------------------------------------------------------------------------ */


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



module.exports = {
    // Save Uploaded Files
    // 10-4-2021 Prayag
    Uploads: async (req, res) => {
        try {
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });

            fs.writeFile(req.body.filename, req.body.data, 'base64', error => {
                if (error) {
                    throw error;
                } else {
                    const bucket = PrivateBucket.bucket('main_pvt');
                    bucket.upload(req.body.filename, { destination: "hospitals/" + req.body.hospitalname + "/" + req.body.filename }, function (err, file) {
                        if (err) {
                            throw new Error(err);
                        }
                        fs.unlinkSync(req.body.filename);
                    });
                }
            });
            res.json('Success')
        } catch (error) {
            console.log(error);
        }
    },


    //UPLOAD QR
    UploadQr: async (req, res) => {
        try {
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });
            fs.writeFile(req.body.filename, req.body.data, 'base64', error => {
                if (error) {
                    throw error;
                } else {
                    const bucket = PrivateBucket.bucket('main_pvt');
                    bucket.upload(req.body.filename, { destination: "hospitals/" + req.body.hospitalname + "/" + req.body.filename }, async function (err, file) {
                        if (err) {
                            throw new Error(err);
                        }
                        const hospitalData = await HospitalSchema.findOne({HID: req.body.HID});
                        // Send notification via Email
                        const Subject = req.body.password;
                        const Message = 'Hi Team,\n\n Hospital with below details has initiated the';
                        const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, hospitalData);
                           fs.unlinkSync(req.body.filename);
                        //    const EmailSendInternal = await SendEmail('pratik@easyaspataal.com', Subject, Message);
                    });
                }
            });
            res.json('Success')
        } catch (error) {
            console.log(error);
        }
    },


    UploadFileForVision: async (req, res) => {
      try {
          const projectId = 'eamigrate';
          const keyFilename = 'src/configuration/private_bucket_keys.json';
          const PrivateBucket = new Storage({ projectId, keyFilename });
          fs.writeFile(req.body.filename, req.body.data, 'base64', error => {
              if (error) {
                  throw error;
              } else {
                  const bucket = PrivateBucket.bucket('main_pvt');
                  async () => {
                  const up = await bucket.upload(req.body.filename, { destination: "hospitals/" + req.body.hospitalname + "/" + req.body.filename }, async function (err, file) {
                      if (err) {
                          throw new Error(err);
                      }
                      const hospitalData = await HospitalSchema.findOne({HID: req.body.HID});
                      // Send notification via Email
                      const Subject = req.body.password;
                      const Message = 'Hi Team,\n\n Hospital with below details has initiated the';
                      const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, hospitalData);
                         fs.unlinkSync(req.body.filename);
                      //    const EmailSendInternal = await SendEmail('pratik@easyaspataal.com', Subject, Message);
                  });}
              }
          });
          res.json('Success')
      } catch (error) {
          console.log(error);
      }
  },


    //upload qr sales

     //UPLOAD QR
     QruploadSales: async (req, res) => {
        try {
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });
            fs.writeFile(req.body.filename, req.body.data, 'base64', error => {
                if (error) {
                    throw error;
                } else {
                    const bucket = PrivateBucket.bucket('main_pvt');
                    bucket.upload(req.body.filename, { destination: "hospitals/" + req.body.hospitalname + "/" + req.body.filename }, async function (err, file) {
                        if (err) {
                            throw new Error(err);
                        }
                        const hospitalData = await HospitalSchema.findOne({HID: req.body.HID});
                        // Send notification via Email
                        // const Subject = req.body.password;
                        //const Message = 'Hi Team,\n\n Hospital with below details has initiated the';
                        // const EmailSend = await SendEmail(hospitalData.email, Subject, hospitalData);
                        //    fs.unlinkSync(req.body.filename);
                        //    const EmailSendInternal = await SendEmail('pratik@easyaspataal.com', Subject, Message);
                    });
                }
            });
            res.json('Success')
        } catch (error) {
            console.log(error);
        }
    },


    // Update Easy Loan Status
    // 17-4-2021 Prayag
    UpdateLoanStatus: async (req, res) => {
        try {
            const { id } = req.body;
            const { status } = req.body;
            EasyLoanSchema.updateOne({ _id: id }, {
                status: status,
            }, function (err, affected, resp) {
                console.log(resp);
            })
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },

    // Hospital Onboarding Excel
    // 27-4-2021 Prayag
    UploadExcel: async (req, res) => {
        try {
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });

           

            fs.writeFile(req.body.filename, req.body.data, 'base64', error => {
                if (error) {
                    throw error;
                } else {
                    // Save Uploaded Excel to Bucket
                    const bucket = PrivateBucket.bucket('main_pvt');
                    bucket.upload(req.body.filename, { destination: "hospitals/" + req.body.filename }, async function (err, file) {
                        if (err) {
                            throw new Error(err);
                        }
                        // Read Excel
                        const excelfile = reader.readFile('./' + req.body.filename);

                      

                        const temp = reader.utils.sheet_to_json(
                            excelfile.Sheets[excelfile.SheetNames[0]]);

                        for (let index = 0; index < temp.length; index++) {
                            const isPresent = await HospitalSchema.findOne({
                                HID: temp[index].HID
                            });
                            if (isPresent) {
                              
                                // Saving Arrays to db names
                                temp[index].Subvention = Subvention;
                              


                                HospitalSchema.update({ HID: temp[index].HID}, temp[index], function (err, raw) {
                                    if (err) {
                                        res.send(err);
                                    }
                                    res.send(raw);
                                });
                              
                            }
                            
                        }
                        fs.unlinkSync(req.body.filename);
                        res.status(200).json(hospitalname);
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    },



    // Hospital Onboard
    // Created : 8-5-2021 Prayag
    OnBoardHospital: async (req, res, next) => {
        try {

            const { email, name, address, phone, slogan, logo, pincode, relationship, city, specialities, facilities, amenities } = req.body;
            console.log(req.body);
            var emailmessage = '';

            const isPresent = await verified_hospitals_schema.findOne({
                name: name,
            });
            if (isPresent) {
                res.status(200).json('exist');
            }
            else {
                const password = passwordgen();

                const HospID = await verified_hospitals_schema.aggregate([
                    { $sort: { 'hospitalId': -1 } },
                    { $limit: 1 },
                    {
                        $project: {
                            hospitalId: 1.0,
                        }
                    },
                ]);
                const hospitalID = HospID[0].hospitalId + 1;

                const salt = await bcrypt.genSalt(10);
                var hashpass = await bcrypt.hash(password, salt);

                const newHospital = new verified_hospitals_schema({
                    name: name,
                    phone1: phone,
                    email: email,
                    address: address,
                    slogan: slogan,
                    city: city,
                    pincode: pincode,
                    relationship: relationship,
                    hospitalId: hospitalID,
                    password: hashpass,
                    hospitalLogo: logo,
                    specialities: specialities,
                    facilities: facilities,
                    amenities: amenities,
                });
                await newHospital.save();

                const CheckCity = await CitiesSchema.findOne({ city: city });
                if (!CheckCity) {
                    const City = await new CitiesSchema({ city: city }).save();
                }

                if (relationship == '2') {
                    var emailmessage = 'Dear Customer,\nPlease find below the ID for logging in hospitals.easyaspataal.com. Due to security reasons, we will not be sharing the password in this mail. Please use the forgot password option at hospitals.easyaspataal.com. A new password will be generated and sent to the registered email address.\n\n\n\n ID : ' + hospitalID + '\n\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                }
                else {
                    var emailmessage = 'Dear Customer,\nCongratulations! Your hospital has been successfully listed on our platform. You may visit easyaspataal.com and view your listing. Looking forward to bringing more business to you.\n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                }

                const accessToken = await oAuth2Client.getAccessToken();
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: 'info@easyaspataal.com',
                        clientId: CLIENT_ID,
                        clientSecret: CLEINT_SECRET,
                        refreshToken: REFRESH_TOKEN,
                        accessToken: accessToken,
                    },
                });

                const mailOptions = {
                    from: 'info@easyaspataal.com',
                    to: 'sampat@easyaspataal.com',
                    subject: 'Welcome aboard to EasyAspataal',
                    text: emailmessage,
                    // html: '<h1>Hello from gmail email using API</h1>',
                };

                transport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                const result = {
                    Status: 1,
                    hospitalId: hospitalID,
                    password: password,
                };
                res.status(200).json(result);
            }

        } catch (error) {
            console.log(error);
            const result = {
                Status: 0,
                Error: error,
            };
            res.status(400).json(result);
        }
    },

    // Delete Hospital
    // 21-5-2021 Prayag
    DeleteHospital: async (req, res) => {
        try {
            const { HospitalID } = req.body;
            verified_hospitals_schema.deleteOne({ _id: HospitalID }, function (err, DeleteCall) {
                if (!err)
                    console.log(DeleteCall);
            });
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Edit Hospital
    // 26-5-2021 Prayag
    EditHospital: async (req, res) => {
        try {
            const { id, name, phone, email, address, city, pincode, relationship, rating, about, slogan, specialities, facilities, amenities } = req.body;
            verified_hospitals_schema.updateOne({ _id: id }, {
                name: name,
                phone1: phone,
                email: email,
                address: address,
                city: city,
                pincode: pincode,
                relationship: relationship,
                rating: rating,
                about: about,
                slogan: slogan,
                specialities: specialities,
                facilities: facilities,
                amenities: amenities,
            }, function (err, affected, resp) {
                console.log(resp);
            })
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Delete Image
    // 28-5-2021 Prayag
    DeleteImage: async (req, res) => {
        try {
            const { name, filename } = req.body;

            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });
            const bucket = PrivateBucket.bucket('main_pvt');
            var file = bucket.file('hospitals/' + name + '/' + filename);
            file.delete();
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Edit Logo
    // 28-5-2021 Prayag
    UpdateLogo: async (req, res) => {
        try {
            const { id, logo } = req.body;
            verified_hospitals_schema.updateOne({ _id: id }, {
                hospitalLogo: logo,
            }, function (err, affected, resp) {
                console.log(resp);
            })
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Save Corporate Vaccination Slots
    // 11-6-2021 Prayag
    SaveVaccinationSlots: async (req, res) => {
        try {
            const { id, slots, venue1, venue2, pincode, enrolled, relationship } = req.body;

            const divided = enrolled / relationship;

            //Get Users
            const Users = await UsersSchema.findOne({ corporate_id: id });
            const range1 = Users.EID;
            var endrange = Number(range1.substring(2));

            for (let index = 0; index < slots.length; index++) {
                slots[index].start_range = 'EA' + endrange;
                var endrange = endrange + (divided - 1);
                slots[index].end_range = 'EA' + endrange;
                endrange++;
            }

            RequestVaccinationSchema.updateOne({ corporate_id: id }, {
                slots: slots,
                venue_address1: venue1,
                venue_address2: venue2,
                venue_pincode: pincode,
                status: 'in process'
            }, function (err, affected, resp) {
                console.log(resp);
            })
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Send Vaccination Notifications
    // 11-6-2021 Prayag
    SendVaccinationNotifications: async (req, res) => {
        try {
            const { id, slots, venue1, venue2, pincode, email } = req.body;

            const UserArr = [];

            //Get all Users
            const Users = await UsersSchema.find({ corporate_id: id });
            for (let userindex = 0; userindex < Users.length; userindex++) {
                var neweid = Number(Users[userindex]['EID'].substring(2));
                UserArr.push({
                    EID: neweid,
                    cmobile: Users[userindex]['cmobile'],
                })
            }

            //Slots 
            for (let index = 0; index < slots.length; index++) {
                const startrange = slots[index].start_range;
                var fstart = Number(startrange.substring(2));
                const endrange = slots[index].end_range;
                var fend = Number(endrange.substring(2));

                for (let slotindex = fstart; slotindex <= fend; slotindex++) {
                    UserArr.map(function (slot) {
                        if (slot.EID == slotindex) {
                            // Send SMS with OTP 
                            const smsSend = SendSMS('123456', slot.cmobile);
                        }
                    });
                }
            }

            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'info@easyaspataal.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLEINT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken,
                },
            });

            const mailOptions = {
                from: 'info@easyaspataal.com',
                to: email,
                subject: 'Vaccination Update',
                text: 'Dear Corporate, \n\n The vaccination drive has been successfully scheduled for your employees. Please find the scheduling details below : \n\n ',
                // html: '<h1>Hello from gmail email using API</h1>',
            };

            transport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },



    Emailotp: async (req, res) => {
        try {
            // var digits = '0123456789';
            // var OTP = '';
            // for (let i = 0; i < 4; i++ ) {
            //     OTP += digits[Math.floor(Math.random() * 10)];
            // }
           
            const smsSend = SendSMS('2345', '7992285806');
            // OtpEmail(req.query.email, 'OTP', OTP);
            // const result = {
            //     code: 200,
            //     status: true,
            //     message: OTP
            // }
            // res.json(result);
            // console.log(result);
        
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



    AgreementJiraStatus: async (req, res) => {
      
        try {
           
            var { claim } = req.body;
            var data = JSON.stringify({
                "body": `Agreement signed`
              });
              
              var config = {
                method: 'post',
                url: 'https://easylos.atlassian.net/rest/api/2/issue/'+claim+'/comment',
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





    AgreementJiraStatusOnboard: async (req, res) => {
      
      try {
         
          var { onb } = req.body;
          var data = JSON.stringify({
              "body": `MOU signed`
            });
            
            var config = {
              method: 'post',
              url: 'https://easylos.atlassian.net/rest/api/2/issue/'+onb+'/comment',
              headers: {
                'Authorization': 'Basic cHJhdGlrQGVhc3lhc3BhdGFhbC5jb206bDkweHM3MEVIQTFhR2phSnhpUm8wMDQ5', 
                'Content-Type': 'application/json', 
                'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_4c3856f95cf10d18c4a77f2566167049344d8601_lin'
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



    Jiraequifax: async (req, res) => {
        try {
          
            var data = JSON.stringify({
              "RequestHeader": {
                "CustomerId": "21",
                "UserId": "UAT_GHALLA",
                "Password": "V2*Pdhbr",
                "MemberNumber": "027BB02400",
                "SecurityCode": "N42",
                "CustRefField": "123456",
                "ProductCode": [
                  "PCS"
                ]
              },
              "RequestBody": {
                "InquiryPurpose": "00",
                "TransactionAmount": "0",
                "FirstName": "Al Zeimers",
                "MiddleName": "",
                "LastName": "",
                "InquiryAddresses": [
                  {
                    "seq": "1",
                    "AddressLine1": "4/47B AMBALAKARA THERU RARAMUTHIRAKKOTTAI RARAMUTHIRAKOTTAI RARAMUTHIRA KOTTAI PAPANASAM THANJAVUR",
                    "City": "",
                    "State": "AS",
                    "AddressType": [
                      "H"
                    ],
                    "Postal": "235703"
                  }
                ],
                "InquiryPhones": [
                  {
                    "seq": "1",
                    "Number": "8850407851",
                    "PhoneType": [
                      "M"
                    ]
                  },
                  {
                    "seq": "2",
                    "Number": "",
                    "PhoneType": [
                      "O"
                    ]
                  }
                ],
                "EmailAddresses": [
                  {
                    "seq": "1",
                    "Email": "abcd@gmail.com",
                    "EmailType": [
                      "O"
                    ]
                  }
                ],
                "IDDetails": [
                  {
                    "seq": "1",
                    "IDValue": "ALYPK1260G",
                    "IDType": "T",
                    "Source": "Inquiry"
                  },
                  {
                    "seq": "2",
                    "IDValue": "",
                    "IDType": "P",
                    "Source": "Inquiry"
                  },
                  {
                    "seq": "3",
                    "IDValue": "",
                    "IDType": "V",
                    "Source": "Inquiry"
                  },
                  {
                    "seq": "4",
                    "IDValue": "",
                    "IDType": "D",
                    "Source": "Inquiry"
                  },
                  {
                    "seq": "5",
                    "IDValue": "",
                    "IDType": "M",
                    "Source": "Inquiry"
                  }
                ],
                "DOB": "1944-05-19",
                "Gender": "M"
              },
              "Score": [
                {
                  "Type": "ERS",
                  "Version": "3.1"
                }
              ]
            });
            
            var config = {
              method: 'post',
              url: 'https://eportuat.equifax.co.in/cir360Report/cir360Report',
              headers: { 
                'Content-Type': 'application/json', 
                'Cookie': 'TS0185b412=0191ea91a48b0355076f6b54bf0b4ebfb43c5c63409eac0b6edc5fa6bed87d30efc0384c46dd5742ba0fdd73c1e7ea5bf1b665b386'
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
            
        } catch (error) {
            console.log(error);
        }
    },



    BitlyJira: async (req, res) => {
        console.log(req.body)
      var { jiralink }= req.body
        try {
            
            var data = JSON.stringify({
              "long_url": `https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=c7d693f6-57d4-45c3-bef6-b052a6b39ee3&Customer_name=${req.body.name}&Application_name=${req.body.name}&Demand_promissory_amount1=${req.body.amount}&Demand_promissory_amount=${req.body.amount}&Demand_promissory_name=${req.body.name}&Applied_repayment_amount=${req.body.amount}&Personal_details_name=${req.body.name}&Personal_details_dob=${req.body.dob}&Personal_details_pan=${req.body.pan}&Personal_details_aadhar=${req.body.aadhar}&Contact_details_houseno=${req.body.address}&Contact_details_city=${req.body.city}&Contact_details_state=${req.body.state}&Contact_details_pin=${req.body.pin}&Bank_accountno=${req.body.account_no}&Bank_bankname=${req.body.bank_name}&Bank_accounttype=${req.body.account_type}&Bank_ifsc=${req.body.ifsc}&Disburse_dealer=${req.body.hospital_name}&Financing_amount=${req.body.amount}&claim_no=${req.body.key}`,
              "domain": "bit.ly",
              "group_guid": "Bla98d6KX93"
            });
            
            var config = {
              method: 'post',
              url: 'https://api-ssl.bitly.com/v4/shorten',
              headers: { 
                'Authorization': 'Bearer 995be43e0b3de2519528ccd7c686ceb311643a52', 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              var linkshort = response.data.link;
              const result = {
                code: 200,
                status: true,
                message:linkshort
            }
            console.log(result);
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



    BitlyJiraOnboard: async (req, res) => {
        
        try {
            
            var data = JSON.stringify({
              "long_url": `https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=dbb722d6-4ea6-4e2f-a6e5-1045f8f56c57&hos_name=${req.body.hospital_name}&hospital_name=${req.body.hospital_name}&payee_name=${req.body.payee_name}&ifsc_code=${req.body.ifsc_code}&acnt_no=${req.body.acnt_no}&bank_branch=${req.body.bank_branch}&bank_name=${req.body.bank_name}&ipd=${req.body.ipd}&opd=${req.body.opd}&insuremb=${req.body.insuremb}`,
              "domain": "bit.ly",
              "group_guid": "Bla98d6KX93"
            });
            
            var config = {
              method: 'post',
              url: 'https://api-ssl.bitly.com/v4/shorten',
              headers: { 
                'Authorization': 'Bearer 995be43e0b3de2519528ccd7c686ceb311643a52', 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              var linkshort = response.data.link;
              const result = {
                code: 200,
                status: true,
                message:linkshort
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



    BitlyJiraAtl: async (req, res) => {
        console.log(req.body)
      var { jiralink }= req.body
        try {
            
            var data = JSON.stringify({
              "long_url": `https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=8fa0de82-3885-4416-9cf2-432f0502f09e&Customer_name=${req.body.name}&Application_name=${req.body.name}&Demand_promissory_amount1=${req.body.amount}&Demand_promissory_amount=${req.body.amount}&Demand_promissory_name=${req.body.name}&Applied_repayment_amount=${req.body.amount}&Personal_details_name=${req.body.name}&Personal_details_dob=${req.body.dob}&Personal_details_pan=${req.body.pan}&Personal_details_aadhar=${req.body.aadhar}&Contact_details_houseno=${req.body.address}&Contact_details_city=${req.body.city}&Contact_details_state=${req.body.state}&Contact_details_pin=${req.body.pin}&Bank_accountno=${req.body.account_no}&Bank_bankname=${req.body.bank_name}&Bank_accounttype=${req.body.account_type}&Bank_ifsc=${req.body.ifsc}&Disburse_dealer=${req.body.hospital_name}&Financing_amount=${req.body.amount}&claim_no=${req.body.key}`,
              "domain": "bit.ly",
              "group_guid": "Bla98d6KX93"
            });
            
            var config = {
              method: 'post',
              url: 'https://api-ssl.bitly.com/v4/shorten',
              headers: { 
                'Authorization': 'Bearer 995be43e0b3de2519528ccd7c686ceb311643a52', 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              var linkshort = response.data.link;
              const result = {
                code: 200,
                status: true,
                message:linkshort
            }
            console.log(result);
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



    BitlyJiraTjfc: async (req, res) => {
      
    var { jiralink }= req.body
      try {
          
          var data = JSON.stringify({
            "long_url": `https://na4.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=aadfc2cf-a639-41d5-afad-6e7e0268b6ad&customer_name=${req.body.name}&amount_i=${req.body.amount}&demad_i=${req.body.name}&amount_ii=${req.body.amount}&personal_name=${req.body.name}&personal_dob=${req.body.dob}&personal_pan=${req.body.pan}&personal_aadhar=${req.body.aadhar}&contact_addr=${req.body.address}d&contact_city=${req.body.city}&contact_state=${req.body.state}&contact_pin=${req.body.pin}&contact_mobile=${req.body.contact}&bank_acnt=${req.body.account_no}&bank_name=${req.body.bank_name}&bank_type=${req.body.account_type}&bank_ifsc=${req.body.ifsc}&disbursement_dealer=${req.body.hospital_name}&applicant_name=${req.body.name}&financing_amount=${req.body.amount}&claim=${req.body.key}`,
            "domain": "bit.ly",
            "group_guid": "Bla98d6KX93"
          });
          
          var config = {
            method: 'post',
            url: 'https://api-ssl.bitly.com/v4/shorten',
            headers: { 
              'Authorization': 'Bearer 995be43e0b3de2519528ccd7c686ceb311643a52', 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            var linkshort = response.data.link;
            const result = {
              code: 200,
              status: true,
              message:linkshort
          }
          console.log(result);
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






    jiraContactVerify: async (req, res) => {
       
        try {
        
            var data = JSON.stringify({
              "fields": {
                "customfield_10417": "Mobile verified",
                "customfield_10418":"Email Verified"
              }
            });
            
            var config = {
              method: 'put',
              url: 'https://easylos.atlassian.net/rest/api/3/issue/'+req.query.claim,
              headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw', 
                'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_37e5682debed8925156bbcc30aca09e307b0ef4d_lin'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              
              const result = {
                code: 200,
                status: true,
                message: 'sucess'
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



    jiraEmailVerify: async (req, res) => {
       
        try {
        
            var data = JSON.stringify({
              "fields": {
                "customfield_10418":"Email Verified"
              }
            });
           
            var config = {
              method: 'put',
              url: 'https://easylos.atlassian.net/rest/api/3/issue/'+req.query.claim,
              headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
                'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw', 
                'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_37e5682debed8925156bbcc30aca09e307b0ef4d_lin'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              
              const result = {
                code: 200,
                status: true,
                message: 'sucess'
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



    Otp: async (req, res) => {
        try {
            var digits = '0123456789';
    var OTP = '';
    for (let i = 0; i < 4; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
            
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: 'error'
            }
            res.json(result);
        }
    },



    //wix-jira onboarding
    WixJiraOnboarding: async (req, res) => {
      
        try {
          console.log(req.body)
          let image = await axios.get("https://static.wixstatic.com/media/49801f_1cbdf891da554efcad3251c69fbba02b~mv2.jpg", {responseType: 'arraybuffer'});
          let returnedB64 = Buffer.from(image.data).toString('base64');
          // console.log(returnedB64);
            var data = JSON.stringify({
                "fields": {
                    "customfield_10473": req.body.rohini_id,
                    "customfield_10474": req.body.gstn_details,
                    "customfield_10475": req.body.year_of_incorp,
                    "customfield_10476": req.body.owners_name,
                    "customfield_10477": req.body.owners_number,
                    "customfield_10478": req.body.owners_email,
                    "customfield_10479": req.body.owners_aadhar,
                    "customfield_10480": req.body.owners_pan,
                  "customfield_10321": req.body.bank_name,
                  "customfield_10320": req.body.acnt_no,
                  "customfield_10322": req.body.ifsc,
                  "customfield_10323": req.body.payee,
                  "customfield_10493": req.body.branchname,
                  "customfield_10067": req.body.hosname,
                  "customfield_10319": req.body.addr,
                  "customfield_10466": req.body.owners_email,
                  "project": {
                    "key": "ONB"
                  },
                  "summary": "HOSPITAL ONBOARDING",
                  "issuetype": {
                    "name": "Task"
                  }
                }
              });
              
              var config = {
                method: 'post',
                url: 'https://easylos.atlassian.net/rest/api/2/issue/',
                headers: { 
                  'Authorization': 'Basic cHJhdGlrQGVhc3lhc3BhdGFhbC5jb206bDkweHM3MEVIQTFhR2phSnhpUm8wMDQ5', 
                  'Content-Type': 'application/json', 
                  'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_4c3856f95cf10d18c4a77f2566167049344d8601_lin'
                },
                data : data
              };
              
              axios(config)
              .then(function (response) {
           
                //
console.log(response.data.key)

                try {
                  // req.body.upldimg.map(val => {
                  //   console.log(val)
                  // })
                  // for(i=0; i<=req.body.upldimg.length;i++){
                   
                    
                  // }
                  fs.writeFile('test', returnedB64, 'base64', error => {
                    if (error) {
                      console.log('error')
                        throw error;
                    } else {
                           
                              var FormData = require('form-data');
                  var fs = require('fs');
                  var data = new FormData();
                  data.append('file', fs.createReadStream("fileres"));
                  
                  var config = {
                    method: 'post',
                    url: 'https://easylos.atlassian.net/rest/api/3/issue/'+response.data.key+'/attachments',
                    headers: { 
                      'X-Atlassian-Token': 'no-check', 
                      'Authorization': 'Basic cHJhdGlrQGVhc3lhc3BhdGFhbC5jb206bDkweHM3MEVIQTFhR2phSnhpUm8wMDQ5', 
                      'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_4c3856f95cf10d18c4a77f2566167049344d8601_lin', 
                      ...data.getHeaders()
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
                  
                       //  fs.unlinkSync('attachment');  
                    }
                });
              
              
              
                } catch (err) {
                    const result = {
                        code: 400,
                        status: false,
                        message: 'error'
                    }
                    res.json(result);
                }


                //
                const result = {
                    code: 200,
                    status: true,
                    message: response.data.key
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



    InsuranceMail: async (req, res) => {
      try {
          var content = 'Hello from EasyAspataal';
          // var OTP = '';
          // for (let i = 0; i < 4; i++ ) {
          //     OTP += digits[Math.floor(Math.random() * 10)];
          // }
         
          
          OtpEmail(req.query.email, 'EasyAspataal', content);
          const result = {
              code: 200,
              status: true,
              message: 'success'
          }
          res.json(result);
          console.log(result);
      
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



  getTokenWithRefresh : async () => {
    try {
        let tokenDetails = await axios.post("https://accounts.google.com/o/oauth2/token", {
           "client_id": "168438088579-d77o04co2nb75sbgqf8lmc1jh01aaiki.apps.googleusercontent.com",
        "client_secret": "Uq2NNmcKr6uR1LyCZ-zvK4r3",
        "refresh_token": "1//04cQGDkJNePgMCgYIARAAGAQSNwF-L9Ir7VTRMwbgzqwq2-5nuL-sQNDSlBKhNekIqgBHvvR743sAX6BeTOU5UpmcTrbTGJGTjQs",
        grant_type: "refresh_token",
        })
        .then(data=> console.log(data))
.catch(err => console.log(err))
       
    } catch (error) {
        return error
    }

},


// getTokenWithRefresh : async () => {
//   try {
  
//     var clientID = '168438088579-d77o04co2nb75sbgqf8lmc1jh01aaiki.apps.googleusercontent.com';
//     var clientSecret = 'Uq2NNmcKr6uR1LyCZ-zvK4r3';
//     var redirectUrls = 'https://developers.google.com/oauthplayground';
//     let oauth2Client = new google.auth.OAuth2(
//       secret.clientID,
//       secret.clientSecret,
//       secret.redirectUrls
// )

// oauth2Client.credentials.refresh_token = '1//04cQGDkJNePgMCgYIARAAGAQSNwF-L9Ir7VTRMwbgzqwq2-5nuL-sQNDSlBKhNekIqgBHvvR743sAX6BeTOU5UpmcTrbTGJGTjQs'

// oauth2Client.refreshAccessToken( (error, tokens) => {
//       if( !error ){
//            // persist tokens.access_token
//            // persist tokens.refresh_token (for future refreshs)
//       }else {
//         console.log(tokens);
//       }
// })
     
  // } catch (error) {
  //     return error
  // }

// }



    
};

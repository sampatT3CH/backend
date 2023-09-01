/* ----------------- This File Saves Data from Corporate ----------------- */
/* ----------------- Created : 29-7-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const fs = require('fs');
const bcrypt = require("bcryptjs");
const reader = require('xlsx');
const { Storage } = require('@google-cloud/storage');
const SendSMS = require('../../third_party/sms');
const SendEmail = require('../../third_party/email');
const passwordgen = require("../helpers/password_gen");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const vision=require('@google-cloud/vision');
const request = require('request');
// const file = require('../../../')

const Pool=require("pg").Pool;
const pool=new Pool({
    user:"postgres",
    password:"sampat",
    database:"postgres",
    host:"localhost",
    port:5432
});


/* ------------------------------------------------------------------------------------------------------------------ */

/* -------------------------------------------------- Schemas -------------------------------------------------- */
const HospitalSchema = require("../../models/new_hospitals");
const AdminSchema = require("../../models/admin/sales-login");
const AgentSchema = require("../../models/agents");
const RohiniSchema = require("../../models/rohini");
/* ------------------------------------------------------------------------------------------------------------------ */


/* ------------------------------------------------logo upload in aws bucket------------------------------------------------------------------ */


/* -------------------------------------------------------logo upload in aws bucket----------------------------------------------------------- */



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
     //Upload Logo in AWS

     uploadLogo: async (req, res) => {

        const AWS = require('aws-sdk');

        
      
        // const { ACCESS_KEY_ID:, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;
      
        AWS.config.setPromisesDependency(require('bluebird'));
        AWS.config.update({ accessKeyId: 'AKIA3JEXLJG7KQZMZOU5', secretAccessKey: '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', region: 'Asia Pacific (Mumbai) ap-south-1'});
      
        const s3 = new AWS.S3();
       const {awslogo} = req.body
        const base64Data = new Buffer.from(awslogo.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      
        const type = awslogo.split(';')[0].split('/')[1];
      
        const userId = 1;
      
        const params = {
          Bucket: 'qreasy',
          Key: `${userId}.${type}`, // type is not required
          Body: base64Data,
          ACL: 'public-read',
          ContentEncoding: 'base64', // required
          ContentType: `image/${type}` // required. Notice the back ticks
        }
      
        let location = '';
        let key = '';
        try {
          const { Location, Key } = await s3.upload(params).promise();
          location = Location;
          key = Key;
        } catch (error) {
        }
      
        console.log(location, key);
      
        return location;
      
      },

    // Check Sales Admin User
    // 3-8-2021 Prayag
    Login: async (req, res) => {
        try {
            const username = req.body.username;

            const AdminDetail = await AdminSchema.findOne({
                username: username,
            });
            if (AdminDetail === null) {
                const result = {
                    code: 404,
                    status: false,
                    message: 'No User Found'
                }
                res.json(result);
            } else {
                const isMatch = await bcrypt.compare(req.body.password, AdminDetail.password);
                if (!isMatch) {
                    const result = {
                        code: 404,
                        status: false,
                        message: 'Invalid Password'
                    }
                    res.json(result);
                }
                else {
                    const result = {
                        code: 200,
                        status: true,
                        message: AdminDetail
                    }
                    res.json(result);
                }
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


    OnBoardHospital: async (req, res) => {
        try {
            // console.log(req.body.bank_details[0].account_no)
            // console.log(req.body)
            const HospitalDataEmail = await HospitalSchema.countDocuments({ email: req.body.email });
           if(HospitalDataEmail == 0){
            const HospitalID = await HospitalSchema.aggregate([
                { $sort: { '_id': -1 } },
                { $limit: 1 },
                {
                    $project: {
                        HID: 1.0,
                    }
                },
            ]);
            var hospitalid = HospitalID[0].HID;
            
            var hospid = Number(hospitalid.substring(2)) + 1;
            

            const newHospital = new HospitalSchema(req.body);
            await newHospital.save();

            const password = passwordgen();
            const salt = await bcrypt.genSalt(10);
            var hashpass = await bcrypt.hash(password, salt);
             

            //PG ADMIN


            // const HospitalIDdup=await pool.query("SELECT hid FROM hospital ORDER BY created_date DESC LIMIT 1 ");
            const bank_details_account_no = req.body.bank_details[0].account_no;
            const bank_details_bank_name = req.body.bank_details[0].bank_name;
            const bank_details_ifsc_code = req.body.bank_details[0].ifsc_code;
            const bank_details_payee_name = req.body.bank_details[0].payee_name;
            const hidddup= 'HS' + hospid;
            const hashpassdup = hashpass;
            const {contact,email,name,subvention_rate}=req.body;
            await pool.query("INSERT INTO hospital (hid,contact,email,name,password,bank_details_account_no,bank_details_bank_name,bank_details_ifsc_code,bank_details_payee_name,subvention_rate) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[hidddup,contact,email,name,hashpassdup,bank_details_account_no,bank_details_bank_name,bank_details_ifsc_code,bank_details_payee_name,subvention_rate]);
           
            //


            HospitalSchema.updateOne({ _id: newHospital._id },
                {
                    HID: 'HS' + hospid,
                    password: hashpass,
                }, function (err, affected, resp) {
                })

            // Send notification via Email
            const Subject = 'Hospital OnboardForm';
            const Message = 'Hi Team,\n\n Hospital with below details has initiated the onboarding\n\nName: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nHID:' + 'HS' + hospid + '\nPassword:' + password;
            const EmailSendInternal = await SendEmail('sampat@easyaspataal.com', Subject, Message);

           

            var headers = {
                'Authorization': 'e20e23bdd6ae9faf6b8eb407de1a88937af69029',
                'Content-Type': 'application/json'
            };
            var dataString = `{ "long_url": "http://qr.easyaspataal.com/${hospid}", "domain": "easptl.com", "title": "${req.body.name}" }`
            var options = {
                url: 'https://api-ssl.bitly.com/v4/bitlinks',
                method: 'POST',
                headers: headers,
                body: dataString
            };

            function callback(error, response, body) {
                var qrLink = JSON.parse(body)
                finalresult(qrLink.link);
            }
            request(options, callback);

            function finalresult(newlink) {
                const result = {
                    code: 200,
                    status: true,
                    message: {
                        hid: 'HS' + hospid,
                        link: newlink,
                        password: password
                    },
                }
                res.json(result);
            }
             
        }else {
            const result = {
                code: 200,
                status: true,
                message: {
                    link:'Hospital Already Present'
                },
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

        }
    },

     //sales qr
     OnBoardSalesForQr: async (req, res) => {
        try {

           
            const newHospital = new HospitalSchema(req.body);
           
            const password = passwordgen();
            const salt = await bcrypt.genSalt(10);
            var hashpass = await bcrypt.hash(password, salt);

            HospitalSchema.updateOne({ _id: newHospital._id },
                {
                   
                    password: hashpass,
                }, function (err, affected, resp) {
                })

                 // Send notification via Email
                 const Subject = 'Hospital OR';
                 const Message = 'Hi Team,\n\n Hospital with below details has initiated the onboarding\n\nName: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nHID:' +'HS'+hospid;
                 const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, Message);
            
            var headers = {
                'Authorization': 'e20e23bdd6ae9faf6b8eb407de1a88937af69029',
                'Content-Type': 'application/json'
            };
            var dataString = `{ "long_url": "http://qr.easyaspataal.com/${hospid}", "domain": "easptl.com", "title": "${req.body.name}" }`
            var options = {
                url: 'https://api-ssl.bitly.com/v4/bitlinks',
                method: 'POST',
                headers: headers,
                body: dataString
            };

            function callback(error, response, body) {
                    var qrLink = JSON.parse(body)
                    finalresult(qrLink.link);
            }
            request(options, callback);

            function finalresult(newlink) {
                console.log(hospid)
                console.log(password)
                const result = {
                    code: 200,
                    status: true,
                    message: {
                        hid: 'HS'+hospid,
                        link:newlink,
                        password:password
                    },
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

        }
    },


     // Save Hospital
    // 29-7-2021 Prayag
    OnBoardHospitalForQr: async (req, res) => {
        try {

            const HospitalID = await HospitalSchema.aggregate([
                { $sort: { '_id': -1 } },
                { $limit: 1 },
                {
                    $project: {
                        HID: 1.0,
                    }
                },
            ]);

            var hospitalid = HospitalID[0].HID;
            var hospid = Number(hospitalid.substring(2)) + 1;

            const newHospital = new HospitalSchema(req.body);
            await newHospital.save();

            const password = passwordgen();
            const salt = await bcrypt.genSalt(10);
            var hashpass = await bcrypt.hash(password, salt);

            /////////////////////////////

           


            /////////////////////////////

            HospitalSchema.updateOne({ _id: newHospital._id },
                {
                    HID: 'HS' + hospid,
                    password: hashpass,
                }, function (err, affected, resp) {
                })


            //    if(req.body.rohini_id == null){
            //       // Send notification via Email
            //    const Subject = 'Hospital OR';
            //    const Message = 'hh';
            //    const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, Message);
            // //    const EmailSendInternal = await SendEmail('sales-ops@easyaspataal.com', Subject, Message);
            //    }

                 // Send notification via Email
                 const Subject = 'Hospital OR';
                 const Message = 'Hi Team,\n\n Hospital with below details has initiated the onboarding\n\nName: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nHID:' +'HS'+hospid;
                 const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, Message);
            //     //  const EmailSendInternal = await SendEmail('sales-ops@easyaspataal.com', Subject, Message);

           

          
            var headers = {
                'Authorization': 'e20e23bdd6ae9faf6b8eb407de1a88937af69029',
                'Content-Type': 'application/json'
            };
            var dataString = `{ "long_url": "http://qr.easyaspataal.com/${hospid}", "domain": "easptl.com", "title": "${req.body.name}" }`
            var options = {
                url: 'https://api-ssl.bitly.com/v4/bitlinks',
                method: 'POST',
                headers: headers,
                body: dataString
            };

            function callback(error, response, body) {
                    var qrLink = JSON.parse(body)
                    finalresult(qrLink.link);
            }
            request(options, callback);

            function finalresult(newlink) {
                console.log(hospid)
                console.log(password)
                const result = {
                    code: 200,
                    status: true,
                    message: {
                        hid: 'HS'+hospid,
                        link:newlink,
                        password:password
                    },
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

        }
    },

    updateHospital: async (req, res) => {
        try {
            console.log('hhh')
            console.log(req.body.id)
            HospitalSchema.updateOne({ _id: req.body.id },
                req.body, function (err, affected, resp) {
                    console.log(resp);
                })


            // Send notification via Email
            const Subject = 'Updated Hospital OnboardForm';
            const Message = 'Hi Team,\n\n Hospital with below details has updated the onboarding\n\nName: ' + req.body.name + '\nEmail: ' + req.body.email + '\nContact: ' + req.body.contact + '\nHID:' + 'HS' + req.body.HID;
            const EmailSend = await SendEmail('prayag@easyaspataal.com', Subject, Message);
            const EmailSendInternal = await SendEmail('sales-ops@easyaspataal.com', Subject, Message);


            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Edit Hospital
    // 9-8-2021 Prayag
    EditHospital: async (req, res) => {
        try {
            HospitalSchema.updateOne({ _id: req.body.id },
                req.body, function (err, affected, resp) {
                    console.log(resp);
                })

            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Approve Hospital
    // 9-8-2021 Prayag
    ApproveHospital: async (req, res) => {
        try {
            HospitalSchema.updateOne({ _id: req.body.id },
                req.body, function (err, affected, resp) {
                    console.log(resp);
                })
            const result = {
                code: 200,
                status: true,
                message: 'Hospital Onboarded Successfully'
            }
            res.json(result);
        } catch (error) {
            console.log(error);
        }
    },

    // Save Agent
    // 7-8-2021 Prayag
    SaveAgent: async (req, res) => {
        try {

            const AgentID = await AgentSchema.aggregate([
                { $sort: { '_id': -1 } },
                { $limit: 1 },
                {
                    $project: {
                        AID: 1.0,
                    }
                },
            ]);
            var agentid = AgentID[0].AID;
            var aid = Number(agentid.substring(2)) + 1;

            const newAgent = new AgentSchema(req.body);
            await newAgent.save();

            // Password Generation
            const password = passwordgen();
            const salt = await bcrypt.genSalt(10);
            var hashpass = await bcrypt.hash(password, salt);

            AgentSchema.updateOne({ _id: newAgent._id },
                {
                    AID: 'AG' + aid,
                    password: hashpass,
                }, async function (err, affected, resp) {
                    // Send notification via Email
                    const Subject = 'Welcome to EasyAspataal';
                    const Message = 'Dear ' + req.body.name + ',\n\n\n Welcome aboard with Easyaspataal. Below are your login credentials for login at https://agent-portal-gwli64osaq-el.a.run.app \n\n UserID: AG' + aid + '\n Password: ' + password + '       \n\n\n\n\n\n Warm Regards,\n EasyAspataal Team';
                    const EmailSend = await SendEmail(req.body.email, Subject, Message);
                    const EmailSendInternal = await SendEmail('shweta@easyaspataal.com', Subject, Message);
                    const result = {
                        code: 200,
                        status: true,
                        message: 'AG' + aid
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

    // Edit Agent
    // 9-8-2021 Prayag
    EditAgent: async (req, res) => {
        try {
            AgentSchema.updateOne({ _id: req.body.id },
                req.body, function (err, affected, resp) {
                    console.log(resp);
                })
            res.status(200).json('Success');
        } catch (error) {
            console.log(error);
        }
    },


    // Save Uploaded Files
    // 12-8-2021 Prayag
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
                    bucket.upload(req.body.filename, { destination: "agents/" + req.body.agentname + "/" + req.body.filename }, function (err, file) {
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


    // Read Excel
    // 31-8-2021 Prayag
    ReadExcel: async (req, res) => {
        try {


            await fs.writeFile(req.body.filename, req.body.data, 'base64', async error => {
                if (error) {
                    throw error;
                } else {
                    // Read Excel
                    const excelfile = reader.readFile('./' + req.body.filename);
                    const temp = reader.utils.sheet_to_json(excelfile.Sheets[excelfile.SheetNames[0]], { raw: false });

                    for (let index = 0; index < temp.length; index++) {
                      
                        if(temp[index]['HID'] === HID ){
                        const newHospital = new HospitalSchema({
                            
                            subvention_fee: temp[index]['Subvention fee']  
                        });
                        await newHospital.save();
                    }
                
                    }
                    fs.unlinkSync(req.body.filename);

                    const result = {
                        code: 200,
                        status: true,
                        message: 'Success'
                    }
                    res.json(result);
                }
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


    editFormEmail: async (req, res) => {
        try {
            const HospitalData = await HospitalSchema.findOne({ _id: req.body.id });
            const Subject = 'Edit Onboard Form';
            const Message = 'Dear ' + HospitalData.name + '\n\nKindly complete your Onboarding form as  your ' + req.body.issues + ' details are missing. Please find the below link to fillup mandatory details \n https://hospon-prod-gwli64osaq-uc.a.run.app/' + req.body.id + '\n\n\nRegards\nTeam Easyaspataal';
            const EmailSend = await SendEmail('sampat@easyaspataal.com', Subject, Message);
            const result = {
                code: 200,
                status: true,
                message: 'Success'
            }
            res.json(result);
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


    UploadFileImage: async (req, res) => {
        try{
                var data;
                  const projectId = 'effective-aria-346508';
                  const keyFilename = 'src/configuration/APIKey.json';
                  const PrivateBucket = new Storage({ projectId, keyFilename });
            var str= req.body.name;
            var base64=req.body.attachment;
            const base64data = base64.substring(base64.indexOf(',') + 1);
            fs.writeFile(str,base64data, 'base64', error => {
                        if (error) {
                            throw error;
                        }
                        else{
                            const bucket =PrivateBucket.bucket('artifacts.effective-aria-346508.appspot.com');
                            bucket.upload(str, { destination: "containers/images/"+str}, async function (err, file) {
                                if (err) {throw new Error(err);}});
                            // fs.unlinkSync(req.body.filename);
                        }
                    });
                setTimeout(quickstart, 1000);
                async function quickstart() {
              // Creates a client
             const client = new vision.ImageAnnotatorClient({
                     keyFilename:'src/configuration/APIKey.json'
              });
                 // Performs label detection on the image file
                const loc=`gs://artifacts.effective-aria-346508.appspot.com/containers/images/${str}`
                 const [result] = await client.textDetection(loc);
                 const text = result.textAnnotations[0].description;
                 const res=text.split(/\n/);
                //  console.log('all data-----  '+res);
                // if(res[1]=='INCOME TAX DEPARTMENT'){
                //     data=[res[5],res[7],res[13]];
                // }else{
                //     data=["else condition"];
                // }
                console.log(res);
                data=[res[4],res[6],res[12]];
                }
                setTimeout((() => {
                    return res.json({
                        status:"sucess",
                        result:data
                    });
                }), 4000)
              }
          catch(err) {
            console.log(err);
            }
        },
};

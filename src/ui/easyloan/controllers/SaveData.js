/* ----------------- This File Saves Data from Admin ----------------- */
/* ----------------- Created : 9-4-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const moment = require('moment');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { Storage } = require('@google-cloud/storage');
const { google } = require('googleapis');

const RequestsSchema = require("../../../models/requests-schema");
const userSchema = require('../../../models/user-schema');
const patientSchema = require('../../../models/patient-info-schema');
const LoanDetailsSchema = require('../../../models/loan-details-schema');
const OTPSchema = require('../../../models/otp-schema');
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
    // Create new user
    // 20-4-2021 Prayag
    CreateUser: async (req, res) => {
        try {
            const { name, mobile, purpose, incomestatus, loanamount, pincode, employement, aadhar, bankfileextension, bankfile, goldpincode, goldgram, othersdata, id } = req.body;
            const userfilename = '';
            const others = [];

            // Save User
            const saveuser = new userSchema({
                name: name,
                mobile: mobile,
            });
            const savedUserDetails = await saveuser.save();

            // Save Patient
            const savepatient = new patientSchema({
                user_id: savedUserDetails._id,
                name: name,
                mobile: mobile,
                relation_with_user: 'self',
                aadhar_no: aadhar,
            });
            const savedPatientDetails = await savepatient.save();


            var emaildate = moment(new Date()).format("DD/MM/YYYY h:mm");

            // Save Request
            const saverequest = new RequestsSchema({
                name: name,
                mobile: mobile,
                pincode: pincode,
                type: 'easyloan',
                surgery: '',
                treatment: '',
                referal: '',
                for: '',
                amount: loanamount,
                reason: purpose,
                from: 'easyloan',
                status: 'pending',
            });
            const savedRequestDetails = await saverequest.save();

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

            var emailcontent = '\nName : ' + name + '\nMobile : ' + mobile + '\nPincode : ' + pincode + '\nType : easyloan \nLoan Amount : ' + loanamount + '\nReason : ' + purpose;
            const mailOptions = {
                from: 'info@easyaspataal.com',
                to: 'info@easyaspataal.com',
                subject: '[easyloan] Request by ' + name + ' on ' + emaildate,
                text: 'We have received a request: The details are as follows: \n' + emailcontent + '\n\nThis email has been generated by a bot.'
                // html: '<h1>Hello from gmail email using API</h1>',
            };

            transport.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });






            if (bankfileextension == undefined || bankfileextension == '' || bankfileextension == null) {
            }
            else {
                const projectId = 'eamigrate';
                const keyFilename = 'src/configuration/private_bucket_keys.json';
                const PrivateBucket = new Storage({ projectId, keyFilename });

                const userfilename = Date.now() + '.' + bankfileextension;

                fs.writeFile(userfilename, bankfile, 'base64', error => {
                    if (error) {
                        throw error;
                    } else {
                        const bucket = PrivateBucket.bucket('main_pvt');
                        bucket.upload(userfilename, { destination: "users/bank" + userfilename }, function (err, file) {
                            if (err) {
                                throw new Error(err);
                            }
                            fs.unlinkSync(userfilename);
                        });
                    }
                });
            }

            if (othersdata == null) {
            }
            else {
                for (let index = 0; index < othersdata.length; index++) {
                    others.push(othersdata[index]);
                }
            }

            // // Save Loan Details
            // const saveloandata = new LoanDetailsSchema({
            //     loan_id: savedLoanRequestDetails._id,
            //     employement: employement,
            //     income_status: incomestatus,
            //     filename: userfilename,
            //     others: others,
            //     gold: {
            //         pincode: goldpincode,
            //         grams: goldgram,
            //     }
            // });
            // const savedLoanDetails = await saveloandata.save();

            res.json('Success')
        } catch (error) {
            console.log(error);
        }
    },
};
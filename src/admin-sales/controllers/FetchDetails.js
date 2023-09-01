/* ----------------- This File Gets Data for Sales Dash ----------------- */
/* ----------------- Created : 3-8-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Storage } = require('@google-cloud/storage');
/* ------------------------------------------------------------------------------------------------------------------ */
/* -------------------------------------------------- Schemas -------------------------------------------------- */
const HospitalSchema = require("../../models/new_hospitals");
const AgentSchema = require("../../models/agents");
const RohiniSchema = require("../../models/rohini");

const Pool=require("pg").Pool;
const pool=new Pool({
    user:"easy_admin",
    password:"EasyAspatal1212",
    database:"ea_hospital_dashboard",
    host:"easyaspataal-staging-instance-1.cbqgtf1hzzqq.ap-south-1.rds.amazonaws.com",
    port:5432
});
/* ------------------------------------------------------------------------------------------------------------------ */
module.exports = {
    // Fetch All Hospitals
    // 2-8-2021 Prayag
    HospitalListing: async (req, res) => {
        try {
            const HospitalsData = await HospitalSchema.find({}, { name: 1, email: 1, contact: 1, status: 1 });
            const result = {
                code: 200,
                status: true,
                message: HospitalsData
            }
            res.json(result);
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error,
            }
            res.json(result);
            console.log(error);
        }
    },
    // Selected Hospital Details
    // 3-8-2021 Prayag
    SelectedHospital: async (req, res) => {
        try {
            const hospitalid = req.query.HospitalID;
           
            const SelectedHospitalData = await HospitalSchema.findById(hospitalid);
           
      
              const HospitalImages = [];
              const HospitalImagesUrls = [];
               
             const RoomImages = [];
             const HospitalImagesUrlsRooms = [];
              
              const HospitalImagesBank = [];
              const HospitalImagesUrlsBank = [];
            const HospitalImagesLegal = [];
            const HospitalImagesUrlsLegal = [];
            const HospitalImagesReg = [];
            const HospitalImagesUrlsReg = [];
            
               const HospitalImagesMou = [];
               const HospitalImagesUrlsMou = [];
               const HospitalImagesDoctors = [];
               const HospitalImagesUrlsDoctors = [];
      
      
            // Get Images from Bucket
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });
            const options = {
                prefix: 'hospitals/'+ SelectedHospitalData.name+'/' ,
            };
            const options2 = {
                version: 'v2', // defaults to 'v2' if missing.
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60, // one hour
            };
            const [files] = await PrivateBucket.bucket('main_pvt').getFiles(options);
            files.forEach(file => {
                HospitalImages.push(file.name);
            });

            for (let index = 0; index < HospitalImages.length; index++) {
                const url = await PrivateBucket
                    .bucket('main_pvt')
                    .file(HospitalImages[index])
                    .getSignedUrl(options2);
                HospitalImagesUrls.push(url[0]);
            }
          
            const options3 = {
                prefix: 'hospitals/'+SelectedHospitalData.name+'-bank/'
               
                
            };
            var [filesbank] = await PrivateBucket.bucket('main_pvt').getFiles(options3);
            filesbank.forEach(file => {
                HospitalImagesBank.push(file.name);
            });
            for (let index = 0; index < HospitalImagesBank.length; index++) {
                const url = await PrivateBucket
                    .bucket('main_pvt')
                    .file(HospitalImagesBank[index])
                    .getSignedUrl(options2);
                HospitalImagesUrlsBank.push(url[0]);
            }
            const options5 = {
                prefix: 'hospitals/'+SelectedHospitalData.name+'-legal/'
         
                
            };
            var [fileslegal] = await PrivateBucket.bucket('main_pvt').getFiles(options5);
            fileslegal.forEach(file => {
                HospitalImagesLegal.push(file.name);
            });
            for (let index = 0; index < HospitalImagesLegal.length; index++) {
                const url = await PrivateBucket
                    .bucket('main_pvt')
                    .file(HospitalImagesLegal[index])
                    .getSignedUrl(options2);
                    HospitalImagesUrlsLegal.push(url[0]);
            }
          
            const options11 = {
                prefix: 'hospitals/'+SelectedHospitalData.name+'-reg/',
              
                
            };
           
            const [filesreg] = await PrivateBucket.bucket('main_pvt').getFiles(options11);
            filesreg.forEach(file => {
                HospitalImagesReg.push(file.name);
            });
            for (let index = 0; index < HospitalImagesReg.length; index++) {
                const url = await PrivateBucket
                    .bucket('main_pvt')
                    .file(HospitalImagesReg[index])
                    .getSignedUrl(options2);
                HospitalImagesUrlsReg.push(url[0]);
            }
            const options9 = {
                prefix: 'hospitals/'+SelectedHospitalData.name+'-mou/'
            
                
            };
            
const [filesmou] = await PrivateBucket.bucket('main_pvt').getFiles(options9);
filesmou.forEach(file => {
    HospitalImagesMou.push(file.name);
});
for (let index = 0; index < HospitalImagesMou.length; index++) {
    const url = await PrivateBucket
        .bucket('main_pvt')
        .file(HospitalImagesMou[index])
        .getSignedUrl(options2);
    HospitalImagesUrlsMou.push(url[0]);
}
const options7 = {
    prefix: 'hospitals/'+SelectedHospitalData.name+'-doctors/'
    
    
};
const [filesdoctors] = await PrivateBucket.bucket('main_pvt').getFiles(options7);
filesdoctors.forEach(file => {
    HospitalImagesDoctors.push(file.name);
});
for (let index = 0; index < HospitalImagesDoctors.length; index++) {
    const url = await PrivateBucket
        .bucket('main_pvt')
        .file(HospitalImagesDoctors[index])
        .getSignedUrl(options2);
    HospitalImagesUrlsDoctors.push(url[0]);
}

const options13 = {
    prefix: 'hospitals/'+SelectedHospitalData.name+'-rooms/'
    
    
};
const [filesrooms] = await PrivateBucket.bucket('main_pvt').getFiles(options13);
filesrooms.forEach(file => {
    RoomImages.push(file.name);
});
for (let index = 0; index < RoomImages.length; index++) {
    const url = await PrivateBucket
        .bucket('main_pvt')
        .file(RoomImages[index])
        .getSignedUrl(options2);
    HospitalImagesUrlsRooms.push(url[0]);
}
      
            const result = {
                code: 200,
                status: true,
                Images: HospitalImagesUrls,
                HospitalDetails: SelectedHospitalData, 
                ImagesBank:HospitalImagesUrlsBank,
                ImagesLegal:HospitalImagesUrlsLegal,
                ImagesReg:HospitalImagesUrlsReg,
                ImagesMou:HospitalImagesUrlsMou,
                ImagesDoctors:HospitalImagesUrlsDoctors,
                ImagesRoom:HospitalImagesUrlsRooms,
            };
            res.status(200).json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json('Fail');
        }
    },
    // Fetch All Agents
    // 8-8-2021 Prayag
    AgentListing: async (req, res) => {
        try {
            const AgentsData = await AgentSchema.find();
            const result = {
                code: 200,
                status: true,
                message: AgentsData
            }
            res.json(result);
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error,
            }
            res.json(result);
            console.log(error);
        }
    },
    // Fetch Selected Agent Data
    // 8-8-2021 Prayag
    SelectedAgent: async (req, res) => {
        try {
            const agentID = req.query.AgentID;
            const AgentData = await AgentSchema.findById(agentID);
            const AgentImages = [];
            const AgentImagesUrls = [];
            // Get Images from Bucket
            const projectId = 'eamigrate';
            const keyFilename = 'src/configuration/private_bucket_keys.json';
            const PrivateBucket = new Storage({ projectId, keyFilename });
            const options = {
                prefix: 'agents/' + AgentData.AID,
            };
            const [files] = await PrivateBucket.bucket('main_pvt').getFiles(options);
            files.forEach(file => {
                AgentImages.push(file.name);
            });
            const options2 = {
                version: 'v2', // defaults to 'v2' if missing.
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60, // one hour
            };
            for (let index = 0; index < AgentImages.length; index++) {
                const url = await PrivateBucket
                    .bucket('main_pvt')
                    .file(AgentImages[index])
                    .getSignedUrl(options2);
                AgentImagesUrls.push(url[0]);
            }
            const result = {
                code: 200,
                status: true,
                message: AgentData,
                Images: AgentImagesUrls,
            }
            res.json(result);
        } catch (error) {
            const result = {
                code: 400,
                status: false,
                message: error,
            }
            res.json(result);
            console.log(error);
        }
    },

    
    // Fetch Selected Rohini Data
    // 1-9-2021 Prayag
    SelectedRohini: async (req, res) => {
        try {
            const rohiniId = req.query.rohiniId;
            const RohiniData = await RohiniSchema.findOne({ rohini_id: rohiniId });
            const result = {
                code: 200,
                status: true,
                message: RohiniData
            }
            res.json(result);
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: error,
            }
            res.json(result);
            console.log(error);
        }
    },



    Selecteduat: async (req, res) => {
        try {
            var axios = require('axios');
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
                "FirstName": req.body.name,
                "MiddleName": "",
                "LastName": "",
                "InquiryAddresses": [
                  {
                    "seq": "1",
                    "AddressLine1": req.body.address,
                    "City": "",
                    "State": req.body.state,
                    "AddressType": [
                      "H"
                    ],
                    "Postal": req.body.pin
                  }
                ],
                "InquiryPhones": [
                  {
                    "seq": "1",
                    "Number": req.body.contact,
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
                    "Email": req.body.email,
                    "EmailType": [
                      "O"
                    ]
                  }
                ],
                "IDDetails": [
                  {
                    "seq": "1",
                    "IDValue": req.body.pan,
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
                "DOB": req.body.dob,
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
                'Cookie': 'TS0185b412=0191ea91a42ee6a42d317fe8d97d8d74fc9ebfec6bef63aa001018a3603d0a40a4b2e75f250be5393fb00dafe46aabeb706e34fb85'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
                if(response.data.CCRResponse.CIRReportDataLst[0].InquiryResponseHeader.HitCode == 00 || response.data.CCRResponse.CIRReportDataLst[0].InquiryResponseHeader.HitCode == 01){
                    
         
          const result = {
            code: 200,
            status: true,
            message:-1,
        
        }
        
        res.json(result);
                }
                else{
                    var score = response.data.CCRResponse.CIRReportDataLst[0].CIRReportData.ScoreDetails[0].Value;
        
          const result = {
            code: 200,
            status: true,
            message:score,
           
        }
        
        res.json(result);
                }
        
            })
            .catch(function (error) {
              console.log(error);
            });
            
        } catch (err) {
            const result = {
                code: 400,
                status: false,
                message: error,
            }
            res.json(result);
            console.log(error);
        }
    },

    GetPin: async (req, res) => {
        try {
           
          console.log(req.query)
            const pin = req.query.pin;

            pool.query('SELECT * FROM pinn WHERE pincode = $1', [pin], (error, results) => {
              if (error) {
                throw error
              }
              res.status(200).json(results.rows)
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

    
   
};

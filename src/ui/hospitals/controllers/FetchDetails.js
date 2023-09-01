/* ----------------- This File Gets Data for UI Hospitals ----------------- */
/* ----------------- Created : 30-8-2021 by Prayag ----------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var fs = require('fs');
/* ------------------------------------------------------------------------------------------------------------------ */

/* -------------------------------------------------- Schemas -------------------------------------------------- */
const HospitalSchema = require("../../../models/new_hospitals");
const InsuranceSchema = require("../../../models/insurance");
const UsersSchema = require('../../../models/users');

var axios = require('axios');
/* ------------------------------------------------------------------------------------------------------------------ */


module.exports = {
    // Fetch Easy Loan Data
    // 12-4-2021 Prayag
    GetHospitals: async (req, res) => {
        try {
            const HospitalsData = await HospitalSchema.find();
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
                message: error
            }
            res.json(result);
            console.log(error);
        }
    },

    // Fetch Selected Hospital Data
    // 2-9-2021 Prayag
    // GetSelectedHospitals: async (req, res) => {
    //     try {
    //         var hidd="HS"+req.query.HID;
    //         const HospitalsData=await pool.query("SELECT * FROM hospital WHERE hid=$1",[hidd]);
    //         console.log(HospitalsData.rows[0]);
    //         const result = {
    //             code: 200,
    //             status: true,
    //             message: HospitalsData.rows[0]
    //         }
    //         res.json(result);
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



    GetSelectedHospitals: async (req, res) => {
      try {
          const HospitalsData = await HospitalSchema.findOne({ HID: 'HS' + req.query.HID });
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
              message: error
          }
          res.json(result);
          console.log(error);
      }
  },

    // Fetch Insurance List
    // 10-9-2021 Prayag
    GetInsurance: async (req, res) => {
        try {
            const InsuranceData = await InsuranceSchema.find({}, 'insurer', function (err, data) {
                const result = {
                    code: 200,
                    status: true,
                    message: data
                }
                res.json(result);
            });
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

    // Fetch User
    // 26-10-2021 Prayag
    GetUser: async (req, res) => {
        try {

            const { mobile } = req.query;

            var UserData = [];

            const CheckUser = await UsersSchema.countDocuments({ mobile: mobile });

            if (CheckUser == 0) {
                const CheckCorpUser = await UsersSchema.countDocuments({ cmobile: mobile });
                if (CheckCorpUser > 0) {
                    var UserData = await UsersSchema.findOne({ cmobile: mobile });
                }
            }
            else {
                var UserData = await UsersSchema.findOne({ mobile: mobile });
            }
            const result = {
                code: 200,
                status: true,
                message: UserData
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
    var patientarr = [];
    var amountarr = [];
    var datearr = [];
    var keyarr = [];
    var statusarr = [];
    var summaryarr = [];
    var createdarr = [];
    var contactarr = [];
    var summarray = [];
    var emndtarr = [];
    var podarr = [];
    var agreementstatusarr = [];
              var paymentstatusarr = [];
    
    response.data.issues.map((issue, index) => {
      
     
if(issue.fields.status.name != 'Ignore Mails'){
  const patientresult = issue.fields.customfield_10382
 
  if(patientresult != null){
   console.log(patientresult.value)
  }
 patientarr.push(patientresult)
 
 const amountresult = issue.fields.customfield_10182
 if(issue.fields.customfield_10182 != null && issue.fields.customfield_10182 > 0){
   amountarr.push(issue.fields.customfield_10182);
   summarray.push(issue.fields.customfield_10182)
 }

 
 if(issue.fields.customfield_10339 == null || issue.fields.customfield_10339 == " " || issue.fields.customfield_10339 == undefined){
  agreementstatusarr.push('Pending')
}
else{
  agreementstatusarr.push(issue.fields.customfield_10339.value)
}

if(issue.fields.customfield_10345 == null || issue.fields.customfield_10345 == "" || issue.fields.customfield_10345 == undefined){
  paymentstatusarr.push('Pending')
}
else{
  paymentstatusarr.push(issue.fields.customfield_10345.value)
}
 
 //emandate
 if(issue.fields.customfield_10408 == "" || issue.fields.customfield_10408 == null){
  emndtarr.push("Pending")
}else{
  emndtarr.push("Sent")
}
//  pod status
if(issue.fields.customfield_10347 == null || issue.fields.customfield_10347 == ""){
  podarr.push('Pending')
}
else{
  podarr.push(issue.fields.customfield_10347.value)
}
 const dateresult = issue.fields.customfield_10090
 datearr.push(dateresult)
   
  const keyresult = issue.key;
  keyarr.push(keyresult)
 
  const statusresult = issue.fields.status.name;
  statusarr.push(statusresult);
 
 
  const summaryresult = issue.fields.summary;
  summaryarr.push(summaryresult);
 
  const createdresult = new Date(Date.parse(issue.fields.created)).toLocaleString().replace(","," ");
  createdarr.push(createdresult)
 
  const contactresult = issue.fields.customfield_10107;
  contactarr.push(contactresult);

}
 

    })
  
    let sum = 0;
    for(let i = 0; i<summarray.length; i++){
      sum+=summarray[i];
    }
    
var items = keyarr.map((keyarr, index) => {
    return {
      key: keyarr,
      status: statusarr[index],
      summary: summaryarr[index],
      created: createdarr[index],
      patient: patientarr[index], 
      amount : amountarr[index],
      date: datearr[index],
      contact: contactarr[index],
      type: 'cashless',
      sumresult: sum,
      agreementstatus: agreementstatusarr[index],
      paymentstatus: paymentstatusarr[index],
      emandate: emndtarr[index],
      pod: podarr[index]
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

   


    LmsJiraList: async (req, res) => {
      
      try {
       
          var reporterId = req.query.reporterId   

var config = {
method: 'get',
url: 'http://easylos.atlassian.net/rest/api/2/search?jql=status=Disbursement&reporterId='+`'${reporterId}'`+'&maxResults=100',
headers: { 
  'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw'
}
};

axios(config)

.then(function (response) {
  var patientarr = [];
  var amountarr = [];
  var datearr = [];
  var keyarr = [];
  var statusarr = [];
  var summaryarr = [];
  var createdarr = [];
  var contactarr = [];
  response.data.issues.map((issue, index) => {
    

const patientresult = issue.fields.customfield_10040
patientarr.push(patientresult)

const amountresult = issue.fields.customfield_10182
amountarr.push(amountresult)

const dateresult = issue.fields.customfield_10090
datearr.push(dateresult)

const keyresult = issue.key;
keyarr.push(keyresult)

const statusresult = issue.fields.status.name;
statusarr.push(statusresult);


const summaryresult = issue.fields.summary;
summaryarr.push(summaryresult);

const createdresult = new Date(Date.parse(issue.fields.created)).toLocaleString().replace(","," ");
createdarr.push(createdresult)

const contactresult = issue.fields.customfield_10107;
contactarr.push(contactresult);

  })


var items = keyarr.map((keyarr, index) => {
  return {
    key: keyarr,
    status: statusarr[index],
    summary: summaryarr[index],
    created: createdarr[index],
    patient: patientarr[index], 
    amount : amountarr[index],
    date: datearr[index],
    contact: contactarr[index],
    type: 'cashless'
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


    //revenue

    RevenueList: async (req, res) => {
      
      try {
        
        
        
        var config = {
          method: 'get',
          url: 'https://easylos.atlassian.net/rest/api/2/search?jql=reporter="sampat@easyaspataal.com"',
          headers: { 
            'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw', 
            'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_acdb2e9279b84c626e7affa3f3156d261574e5f0_lin'
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
      console.log(req.query)
        var claimNo = req.query.claimNo 
       
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
              var commentarr = [];
              var keyarr = [];
              var emndtarr = [];
              var podarr = [];
              var statusarr = [];
            
              
statusarr.push(response.data.fields.status.name);
             keyarr.push(response.data.key)
            //Policy holder name
            policyholdernamearr.push(response.data.fields.customfield_10041)
            //patient name
            patientnamearr.push(response.data.fields.customfield_10040)
            //state
            statearr.push(response.data.fields.customfield_10395[0].value)
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
            //emandate
            if(response.data.fields.customfield_10408 == "" || response.data.fields.customfield_10408 == null){
              emndtarr.push("Not updated")
            }else{
              emndtarr.push("Sent")
            }
            //  pod status
            if(response.data.fields.customfield_10347 == null){
              podarr.push('Not Updated')
            }
            else{
              podarr.push(response.data.fields.customfield_10347.value)
            }
          
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
              response.data.fields.comment.comments.map((val, index) => {
               val.body.content.map((rrr, ind) => {
               rrr.content.map((values) => {
                 if(values.type == 'text'){
                   if(values.text.charAt(0) != '('){
                    commentarr.push(values.text)
                   }
                 }
                })
               })
              
              })

              

              // if(value.type === 'paragraph'){
              //   value.content.map((ans, idex) => {
              //  console.log(ans)
              //   })
              // }

              // response.data.fields.comment.comments.map((val, index) => {
              //   val.body.content.map((value, indx) => {
              //     value.content.map((values, key) => {
              //       commentarr.push(values.text)
              //     })
              //   })
              // })
              


           var items = statearr.map((statearr, index) => {
            return {
              state: statearr,
              status: statusarr[index],
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
              paymentstatus: paymentstatusarr[index],
              key: keyarr[index],
              emandate: emndtarr[index],
              pod: podarr[index]
            }
          });
          
            const result = {
            code: 200,
            status: true,
            message:items,
            comment: commentarr.filter(el => {
                return el != null && el != '' && el != " ";
              })
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



Attachment: async (req, res) => {
      
  try {
    
    fs.writeFile(req.query.name, req.query.attachment, 'base64', error => {
      if (error) {
        console.log('error')
          throw error;
      } else {
        console.log(req.query.attachment)
        console.log('test')
        console.log(req.query.name)      
                var FormData = require('form-data');
    var fs = require('fs');
    var data = new FormData();
    data.append('file', fs.createReadStream(req.query.name));
    
    var config = {
      method: 'post',
      url: 'https://easylos.atlassian.net/rest/api/3/issue/CLAIM-3762/attachments',
      headers: { 
        'X-Atlassian-Token': 'no-check', 
        'Authorization': 'Basic Y2hpcmFnQGVhc3lhc3BhdGFhbC5jb206RngzaHZOeXpzWmRQZjRNcmtzN0s5RUUw', 
        'Cookie': 'atlassian.xsrf.token=2320118d-6d73-4369-addd-eae328a4f16c_0b33257177567ab194658bfe8cef2b3f99163852_lin', 
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
},


};

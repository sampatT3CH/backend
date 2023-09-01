/* ----------------- This File Saves Internal pg database ----------------- */
const axios = require('axios');
/* ----------------- credentials ----------------- */
const Pool=require("pg").Pool;
const pool=new Pool({
  user:"postgres",
  password:"sampat",
  database:"postgres",
  host:"localhost",
  port:5432
});
/* ----------------- credentials ----------------- */





module.exports = {
 // Save Internal Leads
    // 12-4-2021 Sampat
    SaveInternalLeads: async (req, res) => {
        try {
          console.log(req.query)
            const { name, contact, disease, status, email, aptmnt_date, aptmnt_time, dr_name } = req.query

            pool.query('INSERT INTO internal_leads (name, contact, disease, status, email, appointment_date, appointment_time, dr_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, contact, disease, status, email, aptmnt_date, aptmnt_time, dr_name], (error, results) => {
              if (error) {
                throw error
              }
              pool.query('SELECT * FROM internal_leads ORDER BY created_date DESC LIMIT 1', (error, results) => {
                if (error) {
                  throw error
                }
                res.status(200).json('Lead added with id :'  +  results.rows[0]._id)
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


    //registration follow up whatsapp sendpulse
    // 19/07/22 sampat


    regFollowUp: async (req, res) => {
      try{
        console.log('reffollowup')
          var {docname,contact,adate,atime,link} = req.body;
          console.log(req.body);
          ////to get the Auth token
          var datat = qs.stringify({
          'grant_type': 'client_credentials',
          'client_id': '513e4cc7d7e474d739ba07d7f4356ceb',
          'client_secret': 'ac35556913ae0aa58515b064d0174571'
          });
          var configt = {
          method: 'post',
          url: 'https://api.sendpulse.com/oauth/access_token',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          data : datat
          };
          axios(configt)
          .then(function (response) {
          var token=response.data.access_token;
          console.log(token);
          ///for to check already exist or not in sendpulse///
          var configc = {
          method: 'get',
          url: 'https://api.sendpulse.com/whatsapp/contacts/getByPhone?phone='+'91'+contact+'&bot_id=618a3eea68c21d07a21e4964',
          headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer'+ token,
          }
          };
          axios(configc)
          .then(function (response) {
         //if user already exits then send message
         console.log(response.status);
          if(response.status==200){
              var datap = JSON.stringify({
                  "bot_id": "618a3eea68c21d07a21e4964",
                  "phone": '91'+contact,
                  "template": {
                      "name": "registration_follow_up",
                      "language": {
                      "code": "en"
                      },
                      "components": [
                      {
                          "type": "body",
                          "parameters": [
                              {
                                  "type": "text",
                                  "text": docname
                                },
                                {
                                  "type": "text",
                                  "text": adate
                                },
                                {
                                  "type": "text",
                                  "text": atime
                                },
                                {
                                  "type": "text",
                                  "text": link
                                }
                          ]
                      }
                      ]
                  }
                  });
                  var configg = {
                  method: 'post',
                  url: 'https://api.sendpulse.com/whatsapp/contacts/sendTemplateByPhone',
                  headers: {
                      'accept': 'application/json',
                      'Authorization': 'Bearer'+ token,
                      'Content-Type': 'application/json'
                  },
                  data : datap
                  };
                  axios(configg)
                  .then(function (response) {
                    console.log(response);
                  })
                  .catch(function (error) {
                  console.log(error);
                  });
          }
          })
          //if user not exits in sendpulse then add
          .catch( function (error) {
              // console.log(error.response.status);
              if(error.response.status==422){
                  var dataa = JSON.stringify({
                      "phone": '91'+contact,
                      "name": docname,
                      "bot_id": "618a3eea68c21d07a21e4964"
                  });
                  var configa ={
                      method: 'post',
                      url: 'https://api.sendpulse.com/whatsapp/contacts',
                      headers: {
                      'accept': 'application/json',
                      'Authorization': 'Bearer'+ token,
                      'Content-Type': 'application/json'
                      },
                      data : dataa
                  };
                  axios(configa)
                  .then( function (response) {
                      // console.log("added");
                      //send message after adding user
                      var datap = JSON.stringify({
                          "bot_id": "618a3eea68c21d07a21e4964",
                          "phone": '91'+contact,
                          "template": {
                              "name": "registration_follow_up",
                              "language": {
                              "code": "en"
                              },
                              "components": [
                              {
                                  "type": "body",
                                  "parameters": [
                                      {
                                          "type": "text",
                                          "text": docname
                                        },
                                        {
                                          "type": "text",
                                          "text": adate
                                        },
                                        {
                                          "type": "text",
                                          "text": atime
                                        },
                                        {
                                          "type": "text",
                                          "text": link
                                        }
                                  ]
                              }
                              ]
                          }
                          }
                          );
                          var configg = {
                          method: 'post',
                          url: 'https://api.sendpulse.com/whatsapp/contacts/sendTemplateByPhone',
                          headers: {
                              'accept': 'application/json',
                              'Authorization': 'Bearer'+ token,
                              'Content-Type': 'application/json'
                          },
                          data : datap
                          };
                           axios(configg)
                          .then(function (response) {
                          // console.log("sent");
                          })
                          .catch(function (error) {
                          console.log(error);
                          });
                  //   console.log(JSON.stringify(response.data));
                  })
                  .catch(function (error) {
                      console.log(error);
                  });
              }
          });
          })
          .catch(function (error) {
          console.log(error);
          });
      }
      catch (err) {
          const result = {
              code: 400,
              status: false,
              message: 'error'
          }
          res.json(result);
      }
  },

};

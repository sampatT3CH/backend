/* ----------------- This File Gets Data from internal pg database ----------------- */
const jwt = require("jsonwebtoken");
const fs = require('fs');
const bcrypt = require("bcryptjs");

const passwordgen = require("../helpers/password_gen");
/* ----------------- Credentials ----------------- */
const Pool=require("pg").Pool;
const pool=new Pool({
    user:"postgres",
    password:"sampat",
    database:"postgres",
    host:"localhost",
    port:5432
});



module.exports = {
    // Fetch All Internal Leads
    // 12-4-2021 Sampat
    GetInternalLeads: async (req, res) => {
        try {
            pool.query('SELECT * FROM internal_leads ORDER BY _id ASC', (error, results) => {
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


    // Fetch Single Internal Lead By email
    // 12-4-2021 Sampat
    GetSingleInternalLead: async (req, res) => {
        try {
        
            const id = parseInt(req.query.id);
            const email = req.query.email;

            pool.query('SELECT * FROM internal_leads WHERE email = $1', [email], (error, results) => {
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

    // Fetch Single Internal Lead By email
    // 19-7-2022 Sampat
    GetSingleInternalLeadById: async (req, res) => {
        try {
        
            const id = parseInt(req.query.id);
            

            pool.query('SELECT * FROM internal_leads WHERE _id = $1', [id], (error, results) => {
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

    GetInternalDoctors: async (req, res) => {
        try {
            pool.query('SELECT * FROM internal_doctors ORDER BY _id ASC', (error, results) => {
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


     // Fetch Single Doctor by email
    // 15-7-2022 Sampat
    GetSingleInternalDoctor: async (req, res) => {
        try {
            const password = passwordgen();
            const salt = await bcrypt.genSalt(10);
            var hashpass = await bcrypt.hash(password, salt);
            console.log(password + "1");
            console.log(hashpass + "2");
        
            const email = req.query.email;

            pool.query('SELECT * FROM internal_doctors WHERE email = $1', [email], (error, results) => {
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

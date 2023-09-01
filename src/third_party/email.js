const sendemail = async (toemail, subject, message) => {
    const { google } = require('googleapis');
    const nodemailer = require('nodemailer');

    const CLIENT_ID = '168438088579-d77o04co2nb75sbgqf8lmc1jh01aaiki.apps.googleusercontent.com';
    const CLEINT_SECRET = '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';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN = '1//04yPQ41oeUrmSCgYIARAAGAQSNwF-L9Irsogzn0jrsMvz2Jd5uPpOMrWLvGdLsGYqoC5qKv47SThIIIkYg7kBelMJuth5sPqcVZ8';
    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLEINT_SECRET,
        REDIRECT_URI,
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'hospitals@easyaspataal.com',
            clientId: CLIENT_ID,
            clientSecret: CLEINT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    if (subject == 'Patient Payment') {
        var mailOptions = {
            from: 'hospitals@easyaspataal.com',
            to: toemail,
            subject: subject,
            // cc: ['gunjali@easyaspataal.com'],
            html: message,
        };
    }
    else if (subject == 'Hospital OR') {
        var mailOptions = {
            from: 'hospitals@easyaspataal.com',
            to: 'sampat@easyaspataal.com',
            subject: subject,
            html:'<body style="background-color: #E8ECF6;" > <div align="center"> <div > <h1 style="font-size: 40px;"> Welcome Aboard</h1> </div> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/logo_2x.png" alt="logo" style="height: 80px; width: 250px;"> <br/> <p style="color: #0C128E;font-size: 25px;">400+ HOSPITALS | 20000+ CORPORATE EMPLOYEES</p> <br/> <h4 style="color: #0C128E;font-size: 30px;">'+message.name+'</h4> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/hospital_email_template_image.png" alt="logo" style="height: 250px; width: 500px;"> <br/> <br/> <br/> <span style="color: #0C128E;font-size: 20px;">Your EasyAspataal Hospital Dashboard Credentials :</span><br/><br/> <span style="color: #0C128E;font-size: 25px;">Login ID : HS100061</span><br/> <span style="color: #0C128E;font-size: 25px;">Password : mOzkfyiOI%</span> <br/> <br/> <button style="background-color: #6D73FF;color: #FFFFFF;border-radius: 20px;height: 45px;width: 100px;border: none;" ><a style="color: #FFFFFF;" href="https://hospitals.easyaspataal.com/" >LOGIN</a></button> <br/> <br/> <p style="color: #0C128E; font-size: 25px;">How EasyAspataal Dashboard will help you?</p> <br/> <div style="display: inline-block; text-align: left;"> <span style="color: #0C128E;font-size: 20px;">• Go-Cashless with NO Insurance Tie-up</span><br/> <span style="color: #0C128E;font-size: 20px;">• Digital Registration</span><br/> <span style="color: #0C128E;font-size: 20px;">• Receive payments</span><br/> <span style="color: #0C128E;font-size: 20px;">• QR transactions = Bigger Credit Profile (upto10Cr)</span><br/> </div> <br/> <br/> <br/> <span style="color: #0C128E;font-size: 20px;">Please download the following documents,</span><br/> <span style="color: #0C128E;font-size: 20px;">for the further information </span><br/> <br/> <p style="color: #0C128E;font-size: 20px;">Don’t hesitate to reach out if you need any help! </p> <br/> <span style="color: #0C128E;font-size: 20px;">Call Us On</span>&emsp;&emsp;&emsp;&emsp;&emsp;<span style="color: #0C128E;font-size: 20px;">WhatsApp</span><br/> <span style="color: #0C128E;font-size: 20px;">+917292005098</span>&emsp;&emsp;&emsp;<span style="color: #0C128E;font-size: 20px;">+919833379385</span> <br/> <p style="color: #0C128E; font-size: 15px;">*All Right Reserved with Lifebox Technologies Pvt. Ltd.*</p> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/logo_2x.png" alt="logo" style="height: 35px; width: 100px;"> <br/> <br/><span style="color: #0C128E;font-size: 20px;">Please download the following documents,</span><br/> <span style="color: #0C128E;font-size: 20px;">for the further information </span><br/> <br/> </div> </body>',
            attachments: [{
                filename: 'qr.pdf',
                path: './qr.pdf'
            }]
        };
    }
    else if (subject == 'CAM-REPORT') {
        var mailOptions = {
            from: 'hospitals@easyaspataal.com',
            to: 'sampat@easyaspataal.com',
            subject: subject,
           
            attachments: [{
                filename: 'cams.pdf',
                path: './cams.pdf'
            }]
        };
    }
    else if (subject == 'OTP') {
        var mailOptions = {
            from: 'hospitals@easyaspataal.com',
            to: toemail,
            subject: subject,
            html: message
        };
    }
    else if (subject == 'EasyAspataal') {
        var mailOptions = {
            from: 'info@easyaspataal.com',
            to: toemail,
            subject: subject,
            html: message
        };
    }
    else {
        var mailOptions = {
            from: 'info@easyaspataal.com',
            to: toemail,
            subject: 'Hospital Onboarded',
            html: ' <body style="background-color: #E8ECF6;" > <div align="center"> <div > <h1 style="font-size: 40px;"> Welcome Aboard</h1> </div> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/logo_2x.png" alt="logo" style="height: 80px; width: 250px;"> <br/> <p style="color: #0C128E;font-size: 25px;">400+ HOSPITALS | 20000+ CORPORATE EMPLOYEES</p> <br/> <h4 style="color: #0C128E;font-size: 30px;">' + message.name + '</h4> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/hospital_email_template_image.png" alt="logo" style="height: 250px; width: 500px;"> <br/> <br/> <br/> <span style="color: #0C128E;font-size: 20px;">Your EasyAspataal Hospital Dashboard Credentials :</span><br/><br/> <span style="color: #0C128E;font-size: 25px;">Login ID : ' + message.HID + '</span><br/> <span style="color: #0C128E;font-size: 25px;">Password : ' + subject + '</span> <br/> <br/> <button style="background-color: #6D73FF;color: #FFFFFF;border-radius: 20px;height: 45px;width: 100px;border: none;" ><a style="color: #FFFFFF;text-decoration: none;" href="https://hospitals.easyaspataal.com/" >LOGIN</a></button> <br/> <br/> <p style="color: #0C128E; font-size: 25px;">How EasyAspataal Dashboard will help you?</p> <br/> <div style="display: inline-block; text-align: left;"> <span style="color: #0C128E;font-size: 20px;">• Go-Cashless with NO Insurance Tie-up</span><br/> <span style="color: #0C128E;font-size: 20px;">• Digital Registration</span><br/> <span style="color: #0C128E;font-size: 20px;">• Receive payments</span><br/> <span style="color: #0C128E;font-size: 20px;">• QR transactions = Bigger Credit Profile (upto10Cr)</span><br/> </div> <br/> <br/> <br/> <br/> <p style="color: #0C128E;font-size: 20px;">Don’t hesitate to reach out if you need any help! </p> <br/> <button style="background-color: #0C128E;border: none;height: 60px;width: 180px;border-radius: 10px;"> <a href="tel:7292005098" style="text-decoration: none;"> <span style="color: #FFFFFF;font-size: 20px;">Call Us On</span><br/><span style="color: #FFFFFF;font-size: 20px;">+917292005098</span></a> </button><br/><br/><button style="background-color: #0C128E;border: none;height: 60px;width: 180px;border-radius: 10px;"> <a href="https://wa.me/919833379385" style="text-decoration: none;"> <span style="color: #FFFFFF;font-size: 20px;">WhatsApp</span><br/><span style="color: #FFFFFF;font-size: 20px;">+919833379385</span> </a> </button><br/> <p style="color: #0C128E; font-size: 15px;">*All Right Reserved with Lifebox Technologies Pvt. Ltd.*</p> <br/> <img src="https://qreasy.s3.ap-south-1.amazonaws.com/assets/logo_2x.png" alt="logo" style="height: 35px; width: 100px;"> <br/> <br/><span style="color: #0C128E;font-size: 20px;">Please download the below attached documents,</span><br/> <span style="color: #0C128E;font-size: 20px;">for the further information </span><br/> <br/> </div> </body> ',
            attachments: [{
                filename: 'qr.pdf',
                path: './qr.pdf'
            }],
        };
    }


    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
        }
    });

}

module.exports = sendemail;
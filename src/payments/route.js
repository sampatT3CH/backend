/* ----------------- This File Sets Up The Routes Used For Server Sent Events On UI Hospitals ----------------- */
// Created : 30-8-2021 by Prayag
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const router = require("express-promise-router")();
const SaveController = require("./SaveData");
/* ------------------------------------------------------------------------------------------------------------------ */


// Get all Hospitals
// 30-8-2021 Prayag
router
	.route("/startpayment")
	.post(SaveController.InitiatePayment);

	router
	.route("/splitpayment")
	.post(SaveController.SplitPayment);

// Save Payment
// 26-10-2021 Prayag
router
	.route("/savepayment")
	.post(SaveController.SavePayment);


router
	.route("/startfullpayment")
	.post(SaveController.UpdateJiraStatus);
	

router
	.route("/startfullpaymentnew")
	.post(SaveController.UpdateJiraStatusnew);	
	
router
	.route("/smsqrpaymnet")
	.post(SaveController.SmsQrPayment);

router
	.route("/verifypan")
	.post(SaveController.VerifyPan);	


router
	.route("/bmplaadharpan")
	.post(SaveController.Bmplaadharpan);

  

module.exports = router;



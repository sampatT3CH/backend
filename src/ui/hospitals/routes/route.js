/* ----------------- This File Sets Up The Routes Used For Server Sent Events On UI Hospitals ----------------- */
// Created : 30-8-2021 by Prayag
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const router = require("express-promise-router")();
const SaveController = require("../controllers/SaveData");
const FetchController = require("../controllers/FetchDetails");
/* ------------------------------------------------------------------------------------------------------------------ */


// Get all Hospitals
// 30-8-2021 Prayag
router
	.route("/getHospitals")
	.get(FetchController.GetHospitals);

// Get Selected Hospital
// 2-8-2021 Prayag
router
	.route("/getSelectedHospitals")
	.get(FetchController.GetSelectedHospitals);

// Send OTP
// 7-9-2021 Prayag
router
	.route("/checkUser")
	.post(SaveController.SendOTP);

// Onboard User
// 7-9-2021 Prayag
router
	.route("/eRegisterUser")
	.post(SaveController.RegisterUser);

// Easy Finance
// 7-9-2021 Prayag
router
	.route("/easyFinance")
	.post(SaveController.EasyFinance);

// PreAuth
// 7-9-2021 Prayag
router
	.route("/savePreauth")
	.post(SaveController.SavePreAuth);

// Insurance List
// 10-9-2021 Prayag
router
	.route("/getInsuranceList")
	.get(FetchController.GetInsurance);

// Check User
// 26-10-2021 Prayag
router
	.route("/checkUser")
	.get(FetchController.GetUser);

router
    .route("/viewreporterlist")
    .get(FetchController.ViewReporterList);
	
router
    .route("/dasboardjiralist")
    .get(FetchController.DasboardJiraList);	


router
    .route("/lmsjiralist")
    .get(FetchController.LmsJiraList);	

	router
    .route("/revenuelist")
    .get(FetchController.RevenueList);	
	
	router
    .route("/attachment")
    .post(FetchController.Attachment);		

module.exports = router;

/* ----------------- This File Sets Up The Routes Used For Sales Admin ----------------- */
/* ----------------------------------- Created : 2-8-2021 by Prayag -------------------------------------------------- */
/* -------------------------------------------------- Requirements -------------------------------------------------- */
const router = require("express-promise-router")();
const SaveController = require("../controllers/SaveData");
const FetchController = require("../controllers/FetchDetails");
/* ------------------------------------------------------------------------------------------------------------------ */


// Login
// 3-8-2021 Prayag
router
    .route("/login")
    .post(SaveController.Login);

// List Hospitals
// 2-8-2021 Prayag
router
    .route("/hospitalListing")
    .get(FetchController.HospitalListing);

// Onboard Hospital
// 3-8-2021 Prayag
router
    .route("/OnboardHospital")
    .post(SaveController.OnBoardHospital);

router
    .route("/OnboardHospitalForQr")
    .post(SaveController.OnBoardHospitalForQr);


    

// Get Selected Hospital Detail
// 2-8-2021 Prayag
router
    .route("/selectedhospital")
    .get(FetchController.SelectedHospital);

// Edit Hospital
// 9-8-2021 Prayag
router
    .route("/editHospital")
    .post(SaveController.EditHospital);

// Approve Hospital
// 9-8-2021 Prayag
router
    .route("/approveHospital")
    .post(SaveController.ApproveHospital);

// Save Agents
// 7-8-2021 Prayag
router
    .route("/saveAgent")
    .post(SaveController.SaveAgent);

// List Agents
// 8-8-2021 Prayag
router
    .route("/agentListing")
    .get(FetchController.AgentListing);

// Get Selected Agent Detail
// 8-8-2021 Prayag
router
    .route("/selectedAgent")
    .get(FetchController.SelectedAgent);

// Edit Selected Agent
// 8-8-2021 Prayag
router
    .route("/editAgent")
    .post(SaveController.EditAgent);

// Save Uploaded Files
// 12-8-2021 Prayag
router
    .route("/uploadfiles")
    .post(SaveController.Uploads);

// Read Uploaded Excel File
// 31-8-2021 Prayag
router
    .route("/readExcel")
    .post(SaveController.ReadExcel);

// Get Selected Rohini Data
// 31-8-2021 Prayag
router
    .route("/selectedrohini")
    .get(FetchController.SelectedRohini);

router
    .route("/UpdateOnboardHospital")
    .post(SaveController.updateHospital)


// send mail to hospital for editing form
router
    .route("/formeditmail")
    .post(SaveController.editFormEmail)  
    

//Upload logo
router
    .route("/uploadlogo")
    .post(SaveController.uploadLogo)
    
 router
    .route("/ OnboardSalesForQr")
    .post(SaveController.OnBoardSalesForQr)
    

    router
    .route("/selecteduat")
    .post(FetchController.Selecteduat)
    
    
    router
    .route("/uploadfileimg")
    .post(SaveController.UploadFileImage);
    
router
    .route("/getpin")
    .get(FetchController.GetPin)  

module.exports = router;

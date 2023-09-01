

// const getAccessToken = async () => {
//     try {
//         const axios = require('axios');
//         let tokenDetails = await axios.all("https://accounts.google.com/o/oauth2/token", {
//             "client_id": '168438088579-d77o04co2nb75sbgqf8lmc1jh01aaiki.apps.googleusercontent.com',
//             "client_secret": 'Uq2NNmcKr6uR1LyCZ-zvK4r3',
//             "refresh_token": '1//04cQGDkJNePgMCgYIARAAGAQSNwF-L9Ir7VTRMwbgzqwq2-5nuL-sQNDSlBKhNekIqgBHvvR743sAX6BeTOU5UpmcTrbTGJGTjQs',
//             "grant_type": "refresh_token",
//         })
//         .then((res) => {console.log(res)})
//         .catch((err) => {console.log(err)})

//         // const accessToken = tokenDetails.data.access_token
//         // return accessToken
//     } catch (error) {
//         return error
//     }

// }

// getAccessToken()
// .then(data=> console.log(data))
// .catch(err => console.log(err))

// module.exports = getAccessToken;
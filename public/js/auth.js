const axios = require('axios');

module.exports = () => {
    payload = {
        "grant_type" : "client_credentials",
        "client_id" : process.env.client_id,
        "client_secret" : process.env.client_secret
    }

    const url = process.env.authURL + '/v2/token';

    return axios
        .post(url, payload)
        .then(resp => {
            return resp.data.access_token;
        })
        .catch(error => {
            console.error(error);
        })
}
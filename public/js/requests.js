const axios = require('axios');

module.exports = (type, telefone, subscriberkey, tkn) => {
    if (type === 'auth') {
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
    } else if (type === 'sendsms') {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tkn
        }

        const payload = {
            "Subscribers": [
                {
                    "MobileNumber": telefone,
                    "SubscriberKey": subscriberkey
                }
            ],
            "Subscribe": true,
            "Resubscribe": true,
            "keyword": "LANISCHIDA",
            "SendTime": "2012-10-05 20:01"
        }

        console.log('Payload SMS: ' + JSON.stringify(payload));
    
        const url = process.env.restURL + '/sms/v1/messageContact/MzA6Nzg6MA/send';


        return axios
            .post(url, payload, {
                headers: headers
            })
            .then(resp => {
                return resp.data;
            })
            .catch(error => {
                console.error(error);
            })
    }
}
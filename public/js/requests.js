const axios = require('axios');

module.exports = (type) => {
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
        payload = {
            "Subscribers": [
                {
                    "MobileNumber": '{{Event.' + eventDefinitionKey + '.Telefone}}',
                    "SubscriberKey": '{{Contact.Key}}'
                }
            ],
            "Subscribe": true,
            "Resubscribe": true,
            "keyword": "LANISCHIDA",
            "SendTime": "2012-10-05 20:01"
        }
    
        const url = process.env.restURL + '/sms/v1/messageContact/MzA6Nzg6MA/send';


        console.log(payload);


        // return axios
        //     .post(url, payload)
        //     .then(resp => {
        //         return resp.data.access_token;
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     })
    }
}
const express = require('express')
const server = express()

const port = process.env.PORT || 3333;
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path')
const JWT = require('./public/js/jwtDecoder.js')
const apirequest = require('./public/js/requests.js')
const configJSON = require('./public/config/config-json.js')
require('dotenv').config()

// Set engine
server.set('view engine', 'ejs');

// Static
server.use(express.static(path.join(__dirname, 'public')));

// Body parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.raw({type: 'application/jwt'}));

server.get('/', (req, res) => {
    res.redirect('/index.html')
})

server.get('/index.html', (req, res) => {
    res.render('./index.ejs')
})

// Return JSON
server.get('/config.json', (req, res) => {
    res.status(200).json(configJSON(req));
});

// Return JWT
server.get('/auth', (req, res) => {

});

// customActivity
server.get('/customActivity.js', (req, res) => {
    res.redirect('js/customActivity.js');
});


// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// CONFIGURATION
// ```````````````````````````````````````````````````````
// Reference:
// https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm


/**
 * Called when a journey is saving the activity.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/save', function(req, res) {
    console.log('debug: /save');
    return res.status(200).json({});
});

/**
 * Called when a Journey has been published.
 * This is when a journey is being activiated and eligible for contacts
 * to be processed.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/publish', function(req, res) {
    console.log('debug: /publish');
    return res.status(200).json({});
});

/**
 * Called when a Journey has been unpublished.
 * @return {[type]}     [description]
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/unpublish', function(req, res) {
    console.log('debug: /unpublish');
    return res.status(200).json({});
});

/**
 * Called when Journey Builder wants you to validate the configuration
 * to ensure the configuration is valid.
 * @return {[type]}
 * 200 - Return a 200 iff the configuraiton is valid.
 * 30x - Return if the configuration is invalid (this will block the publish phase)
 * 40x - Return if the configuration is invalid (this will block the publish phase)
 * 50x - Return if the configuration is invalid (this will block the publish phase)
 */
server.post('/validate', function(req, res) {
    console.log('debug: /validate');
    return res.status(200).json({});
});


// ```````````````````````````````````````````````````````
// BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
//
// EXECUTING JOURNEY
// ```````````````````````````````````````````````````````

/**
 * Called when a Journey is stopped.
 * @return {[type]}
 */
server.post('/stop', function(req, res) {
    console.log('debug: /stop');
    return res.status(200).json({});
});

/**
 * Called when a contact is flowing through the Journey.
 * @return {[type]}
 * 200 - Processed OK
 * 3xx - Contact is ejected from the Journey.
 * 4xx - Contact is ejected from the Journey.
 * 5xx - Contact is ejected from the Journey.
 */
server.post('/execute', function(req, res) {
    console.log('debug: /execute');

    const request = JWT(req.body);

    const url = 'https://eo8qif9pyzfou2p.m.pipedream.net'

    // Find the in argument
    function getInArgument(k) {
        if (request && request.inArguments) {
            for (let i = 0; i < request.inArguments.length; i++) {
                let e = request.inArguments[i];
                if (k in e) {
                    return e[k];
                }
            }
        }
    }

    const payload = request.inArguments;
    const headers = {
        'Content-Type': 'application/json'
    }

    const inArguments = request.inArguments


    var selectedValue = null;

    for (var i = 0; i < inArguments.length; i++) {
        if ("selected" in inArguments[i]) {
            selectedValue = inArguments[i].selected;
        } else if ("telefone" in inArguments[i]) {
            telefone = inArguments[i].telefone;
        } else if ("subscriberkey" in inArguments[i]) {
            subscriberkey = inArguments[i].subscriberkey;
        }
    }

    console.log('valor selecionado: ' + selectedValue);

    if (selectedValue === 'httprequest') {
        axios
        .post(url, payload, {
            headers: headers
        })
        .then(resp => {
            return res.status(200).json(resp.data);
        })
        .catch(error => {
            console.error(error);
            return res.status(500).json(error);
        })
    } else if (selectedValue === 'sms') {
        apirequest('auth')
        .then(token => {
            console.log('Access Token: ' + token)
            return tkn;
        })
        .catch(error => {
            console.log(error);
        })

        apirequest('sendsms', telefone, subscriberkey, tkn)
        .then(resp => {
            console.log('Resposta: ' + resp)
        })
        .catch(error => {
            console.log(error);
        })
    }
});


server.listen(port, '0.0.0.0', () => {
    console.log(`App listening at port ${port}`);
})
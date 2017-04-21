'use strict';

const request = require('request')
const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhookToChatbot/', function (req, res) {

    console.log('webhookToChatbot request....................');

    try {
//         var speech = 'empty speech';
         var botResponse = '';

        if (req.body) {
//             var requestBody = req.body;

//             if (requestBody.result) {
//                 speech = '';

//                 if (requestBody.result.fulfillment) {
//                     speech += requestBody.result.fulfillment.speech;
//                     speech += ' ';
//                 }

//                 if (requestBody.result.action) {
//                     speech += 'action: ' + requestBody.result.action;
//                 }
//             }
             console.log("Text : "+req.body.result.resolvedQuery);
            request({
				url: 'http://72.55.146.142:9091/chatbot/rest/Chatbot/getResponse?request='+req.body.result.resolvedQuery,
				method: 'GET',
				async:false
				}, function(error, response, body) {
				if (error) {
					console.log('Error sending messages: ', error)
				}else{
					console.log("in else response block............");
					console.log(response.body);
					botResponse += response.body;
				}
			})
        }
			
        console.log('webhookToChatbot result: ', botResponse);

        return res.json({
            speech: botResponse,
            displayText: botResponse,
            source: 'r2goyal/apiai_nodejs'
        });
    } catch (err) {
        console.error("Can't process request for webhookToChatbot ", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});

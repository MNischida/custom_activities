module.exports = function configJSON(req) {
    var fullURL = `https://${req.headers.host}`

	return {
		"workflowApiVersion": "1.1",
		"metaData": {
			"icon": "../images/custom-activity.png",
			"category": "message"
		},
		"type": "Rest",
		"lang": {
			"name": "Custom Activity Example",
			"description": "A custom Journey Builder activity example."
		},
		"arguments": {
			"execute": {
				"inArguments": [{
					"myInArgument": "inArgument coming from iframe"
				}],
				"outArguments": [],
				"timeout": 20000,
				"retryCount": 0,
				"retryDelay": 1000,
				"concurrentRequests" : 5,
				//"url": `${fullURL}/execute`
                "url": "https://eo8qif9pyzfou2p.m.pipedream.net"
			}
		},
		"configurationArguments": {
			"applicationExtensionKey": "uniqueKey-CA",
            "save": {
				"url": `${fullURL}/save`
			},
			"publish": {
				"url": `${fullURL}/publish`
			},
			"unpublish": {
				"url": `${fullURL}/unpublish`
			},
			"validate": {
				"url": `${fullURL}/validate`
			},
			"stop": {
				"url": `${fullURL}/stop`
			}
		},
		"wizardSteps": [
			{
				"label": "Step 1",
				"key": "step1"
			},
			{
				"label": "Step 2",
				"key": "step2"
			}
		],
		"userInterfaces": {
            "configInspector": {
                "size": "medium",
                "hideHeader": true,
                "emptyIframe": false
            },
            "configurationSupportsReadOnlyMode": true
          },
		"schema": {
			"arguments": {
				"execute": {
					"inArguments": [],
					"outArguments": []
				}
			}
		}
	}
}
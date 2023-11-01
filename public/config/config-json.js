module.exports = function configJSON(req) {
    var fullURL = `https://${req.get('host')}`

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
                "usejwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/execute`
			}
		},
		"configurationArguments": {
			"applicationExtensionKey": "uniqueKey-CA",
            "save": {
                "usejwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/save`
			},
			"publish": {
                "usejwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/publish`
			},
			"unpublish": {
                "usejwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/unpublish`
			},
			"validate": {
                "usejwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/validate`
			},
			"stop": {
                "usejwt": true,
                "customerKey": "custom-activity",
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
			},
            {
				"label": "Step 3",
				"key": "step3"
			}
		],
		"userInterfaces": {
            "configInspector": {
                "size": "medium",
                "hideHeader": true,
                "emptyIframe": false
            }
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
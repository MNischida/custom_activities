module.exports = function configJSON(req) {
    var fullURL = `https://${req.get('host')}`

	return {
		"workflowApiVersion": "1.1",
		"metaData": {
			"icon": "../images/custom-activity.png",
			"category": "message",
			"configOnDrop": true
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
				},{
					"canal": "SMS"
				}],
				"outArguments": [{
					"resposta": "null"
				},
				{
					"tokenId": null
				}],
				"timeout": 20000,
				"retryCount": 2,
				"retryDelay": 1000,
				"concurrentRequests" : 5,
                "useJwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/execute`
			}
		},
		"configurationArguments": {
			"applicationExtensionKey": "demo-custom-activity",
            "save": {
                "useJwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/save`
			},
			"publish": {
                "useJwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/publish`
			},
			"validate": {
                "useJwt": true,
                "customerKey": "custom-activity",
				"url": `${fullURL}/validate`
			},
			"stop": {
                "useJwt": true,
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
					"outArguments": [{
						"resposta": {
							"dataType": "Text",
							"access": "visible",
							"direction": "out"
						},
						"tokenId": {
							"dataType": "Text",
							"access": "visible",
							"direction": "out"
						}
					}]
				}
			}
		}
	}
}
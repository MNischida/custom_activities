module.exports = function configJSON(req) {
	var fullURL = `https://${req.headers.host}`

	return {
		"workflowApiVersion": "1.1",
		"metaData": {
			"icon": "../images/test.png",
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
					"myInArgument": "inArgument coming from iframe",
					"shortcode": 1234
				}],
				"outArguments": [],
				"timeout": 100000,
				"retryCount": 1,
				"retryDelay": 10000,
				"concurrentRequests" : 5,
				"url": `${fullURL}/execute`
			}
		},
		"configurationArguments": {
			"applicationExtensionKey": "ca_example",
			"publish": {
				"url": `${fullURL}/publish`
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
			"configModal": {
				"fullscreen": true
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
define([ 'postmonger' ], function(Postmonger) {
    "use strict";

    var connection = new Postmonger.Session();
    var payload = {};

    var steps = [
        // initialize to the same value as what's set in config.json for consistency
        { label: "Step 1", key: "step1" },
        { label: "Step 2", key: "step2", active: false }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on("initActivity", initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on("clickedNext", onClickedNext);
    connection.on("clickedBack", onClickedBack);
    connection.on("gotoStep", onGotoStep);

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger("ready");

        // Disable the next button if a value isn't selected
        $("#field1").change(function () {
            var field1 = getData();
            connection.trigger("updateButton", {
              button: "next",
              enabled: Boolean(field1)
            });
          });
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        var field1;
        var hasInArguments = Boolean(
            payload["arguments"] &&
            payload["arguments"].execute &&
            payload["arguments"].execute.inArguments &&
            payload["arguments"].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments
            ? payload["arguments"].execute.inArguments
            : {};

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === "message") {
                    field1 = val;
                }
            });
        });

        // If there is no message selected, disable the next button
        if (!field1) {
            showStep(null, 1);
            connection.trigger("updateButton", { button: "next", enabled: false });
            // If there is a message, skip to the summary step
        } else {
            showStep(null, 2);
        }
    }

    function onClickedNext() {
        if (currentStep.key === 'step2') {
            save();
        } else {
            connection.trigger('nextStep');
        }
    }

    function onClickedBack() {
        connection.trigger('prevStep');
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger('ready')
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }
    
        currentStep = step;
    
        $(".step").hide();
    
        switch (currentStep.key) {
            case "step1":
                $("#step1").show();
                connection.trigger("updateButton", {
                    button: "next",
                    enabled: Boolean(getData()),
                });
                connection.trigger("updateButton", {
                    button: "back",
                    visible: false,
                });
                break;
            case "step2":
                $("#step2").show();
                connection.trigger("updateButton", {
                    button: "back",
                    visible: true,
                });
                connection.trigger("updateButton", {
                    button: "next",
                    text: "Done",
                    visible: true,
                });
                break;
        }
    }

    function save() {
        payload['arguments'].execute.inArguments[0].field1 = $('#field1').val();
        payload['arguments'].execute.inArguments[0].field2 = $('#field2').val();
    }


    function onGetTokens(tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        // console.log(tokens);
    }
    
    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. 'rest.s1.qa1.exacttarget.com'
        // console.log(endpoints);
    }


    function deFields() {
        connection.trigger('requestSchema');

        connection.on('requestedSchema', function (data) {
            console.log('*** Schema ***', JSON.stringify(data['schema']));
        })
    }

    function getData() {
        var input = $('#field1');

        if (input.val()) {
            return input.val();
        } else {
            return null;
        }
    }












});
define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    var steps = [
        { label: 'Step 1', key: 'step1' },
        { label: 'Step 2', key: 'step2' }
    ];

    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGoToStep);

    function onRender() {
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');

        $('#field1').change(function () {
            connection.trigger('updateButton', {
                button: 'next',
                enabled: Boolean(getField())
            });
        })
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        var field1, field2

        if (payload["arguments"].execute.inArguments[2].field1) {
            field1 = $("#field1").val(payload["arguments"].execute.inArguments[2].field1);
        } else if (payload["arguments"].execute.inArguments[2].field2) {
            field2 = $("#field2").val(payload["arguments"].execute.inArguments[3].field2);
        }

        //$("#message1").html(JSON.stringify(payload));

        if (!field1) {
            showStep(null, 1);
            connection.trigger("updateButton", { button: "next", enabled: Boolean(getField()) });
        } else if (field1 && !field2) {
            showStep(null, 2);
            connection.trigger("updateButton", { button: "next", text: 'Done', enabled: false });
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

    function onGoToStep(step) {
        showStep(step);
        connection.trigger('ready');
    }

    function showStep(step, stepIndex) {
        if (stepIndex && !step) {
            step = steps[stepIndex - 1];
        }

        currentStep = step;

        $('.step').hide();

        switch (currentStep.key) {
            case 'step1':
                $('#step1').show();
                connection.trigger('updateButton', {
                    button: 'next',
                    enabled: Boolean(getField())
                });
                connection.trigger('updateButton', {
                    button: 'back',
                    visible: false
                });
                break;
            case 'step2':
                $('#step2').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    enabled: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'Done',
                    visible: true
                });
                break;
        }
    }

    function onGetTokens(tokens) {
    // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
    // console.log(tokens);
    }

    function onGetEndpoints(endpoints) {
    // Response: endpoints = { restHost: <url> } i.e. 'rest.s1.qa1.exacttarget.com'
    // console.log(endpoints);
    }

    function save() {
        var eventDefinitionKey;

        connection.trigger('requestTriggerEventDefinition');

        connection.on('requestedTriggerEventDefinition', function (eventDefinitionModel) {
            eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;

            const iArg = payload['arguments'].execute.inArguments

            const objects = [
                {telefone: '{{Event.' + eventDefinitionKey + '.Telefone}}'},
                {field1: $('#field1').val()},
                {field2: $('#field2').val()}
            ]

            for (const obj1 of objects) {
                const chaves = Object.keys(obj1);
                let encontrado = false;
            
                for (const objeto of iArg) {
                    if (chaves.some(chave => objeto.hasOwnProperty(chave))) {
                        encontrado = true;
                        chaves.forEach(chave => {
                            if (objeto.hasOwnProperty(chave)) {
                                objeto[chave] = obj1[chave];
                            }
                        });
                        break; // Saia do loop assim que encontrar o objeto correspondente
                    }
                }
            
                if (!encontrado) {
                    iArg.push(obj1);
                }
            }
                
            payload['metaData'].isConfigured = true;
            connection.trigger('updateActivity', payload);
        })
    }

    function getField() {
        return $('#field1').val()
    }
})
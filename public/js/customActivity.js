define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    var steps = [
        // initialize to the same value as what's set in config.json for consistency
        { label: "Step 1", key: "step1" },
        { label: "Step 2", key: "step2" },
        { label: "Step 3", key: "step3" }
      ];
      var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        connection.trigger('ready');

        $('#field1').change(function () {
            connection.trigger('updateButton', {
                button: 'next',
                enabled: Boolean(getField('field1'))
            });
        })
        $('#field2').change(function () {
            connection.trigger('updateButton', {
                button: 'next',
                enabled: Boolean(getField('field2'))
            });
        })
        $("#select").change(function () {
            var message = getMessage();
            connection.trigger("updateButton", {
              button: "next",
              text: "done",
              enabled: Boolean(message),
            });
        })
    }

    function initialize(data) {
        if (data) {
            payload = data;
        }

        var field1, field2, selected

        field1 = $("#field1").val(payload["arguments"].execute.inArguments[2].field1);
        field2 = $("#field2").val(payload["arguments"].execute.inArguments[3].field2);
        selected = $("#select").val(payload["arguments"].execute.inArguments[4].selected);

        if (field1) {
            connection.trigger('updateButton', {
                button: 'next',
                enabled: Boolean(getField('field1'))
            });
        }
    }

    function onClickedNext() {
        if (currentStep.key === 'step1' || currentStep.key === 'step2') {
            connection.trigger("nextStep");
        } else {
            save();
        }
    }

    function onClickedBack() {
        connection.trigger("prevStep");
    }

    function onGotoStep(step) {
        showStep(step);
        connection.trigger("ready");
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
                    enabled: Boolean(getField('field1'))
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
                    enabled: Boolean(getField('field2'))
                });
                break;
            case 'step3':
                $('#step3').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    enabled: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'done',
                    enabled: Boolean(getMessage())
                });
                break;
        }
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
                {field2: $('#field2').val()},
                {selected: getMessage()}
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

    function getField(field) {
        return $('#' + field).val()
    }

    function getMessage() {
        return $("#select").find("option:selected").attr("value").trim();
    }
})
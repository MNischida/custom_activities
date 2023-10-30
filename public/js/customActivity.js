define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};

    var step = 1;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);

    connection.on('clickedNext', onClickedNext);
    connection.on('clickedBack', onClickedBack);
    connection.on('gotoStep', onGotoStep);

    function onRender() {
        connection.trigger('ready');

        $("#message1").html(step);

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

        field1 = $("#field1").val(payload["arguments"].execute.inArguments[2].field1);
        field2 = $("#field2").val(payload["arguments"].execute.inArguments[3].field2);

        $("#message1").html('teste');

        gotoStep(step);

        // if (!field1) {
        //     step = 1;
        //     gotoStep(step);
        //     $("#message1").html('1');
        // } else if (field1 && !field2) {
        //     step = 2;
        //     gotoStep(step);
        //     $("#message1").html('2');
        // } else {
        //     step = 2;
        //     gotoStep(step);
        //     $("#message1").html('3');
        // }
    }

    function onClickedNext() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    }

    function onClickedBack() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    }

    function onGotoStep(step) {
        gotoStep(step);
        connection.trigger("ready");
    }

    function gotoStep(step) {
        $('.step').hide();

        switch (step) {
            case 1:
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
            case 2:
                $('#step2').show();
                connection.trigger('updateButton', {
                    button: 'back',
                    enabled: true
                });
                connection.trigger('updateButton', {
                    button: 'next',
                    text: 'done',
                    visible: true
                });
                break;
            case 3:
                save();
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
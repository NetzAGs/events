import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
    extraSignupFields: [{
        fieldName: "name",
        fieldLabel: "Name",
        inputType: "text",
        visible: true,
        validate: function(value, errorFunction) {
            if (!value) {
                errorFunction("Please write your full name");
                return false;
            } else {
                return true;
            }
        }
    }, {
        fieldName: "birthdate",
        fieldLabel: "Birthdate (YYYY-MM-DD)",
        inputType: "date",
        visible: true
    }, {
        fieldName: "phone",
        fieldLabel: "Phone (optional)",
        inputType: "tel",
        visible: true
    }, {
        fieldName: "dorm",
        fieldLabel: "Dorm",
        class: "form-control",
        inputType: "select",
        showFieldLabel: false,
        empty: "Select dorm",
        data: [{
            id: 1,
            label: "WEH",
            value: "weh"
        }, {
            id: 2,
            label: "OIH",
            value: "oih"
        }, {
            id: 3,
            label: "OPH",
            value: "oph"
        }, {
            id: 4,
            label: "TvK",
            value: "tvk"
        }, {
            id: 5,
            label: "Extern",
            value: "extern"
        }],
        visible: true
    }, {
        fieldName: "room",
        fieldLabel: "Room",
        inputType: "number",
        visible: true
    }, {
        fieldName: "lang",
        fieldLabel: "Prefered language",
        class: "form-control",
        inputType: "select",
        showFieldLabel: false,
        data: [{
            id: 1,
            label: "english",
            value: "en"
        }, {
            id: 2,
            label: "deutsch",
            value: "de"
        }],
        visible: true
    }]
});

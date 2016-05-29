import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.App_body.onCreated(function() {
    Meteor.subscribe('events');
    Meteor.subscribe('tasks');
    Meteor.subscribe('slots');
    Meteor.subscribe('volunteers');
    Meteor.subscribe('users');
});

Template.App_body.helpers({
    userNotVerified() {
        if(!Meteor.user()) {
            return false;
        }
        for(let mail of Meteor.user().emails) {
            if(mail.verified) {
                return false;
            }
        }
        return true;
    }
});

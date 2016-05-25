import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.registerHelper('localDate', function(date) {
    if(date) {
        return date.toLocaleDateString();
    }
});

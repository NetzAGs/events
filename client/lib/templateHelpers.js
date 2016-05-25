import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.registerHelper('inputDate', function(date) {
    if(date) {
        return moment(date).format("YYYY-MM-DD");
    }
});

Template.registerHelper('displayDate', function(date) {
    if(date) {
        return moment(date).format("D.M.YYYY");
    }
});

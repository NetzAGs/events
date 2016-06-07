import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_list.helpers({
	events() {
	    return Events.find({closed: false}); 
	}
});


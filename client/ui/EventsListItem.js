import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_list_item.events({
	'click button.event-join'(event) {
        FlowRouter.go('events.detail', this);
	},  
	'click button.event-admin'(event) {
        FlowRouter.go('events.admin', this);
	},  
});


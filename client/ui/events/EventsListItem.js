import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_list_item.helpers({
    eventPath() {
        return FlowRouter.path('events.detail', this);
    }
});
Template.Events_list_item.events({
	'click button.event-admin'(event) {
        FlowRouter.go('events.admin', this);
	},  
    'click .event-delete': function(event) {
        event.preventDefault();
        let thisEvent = this;
        bootbox.confirm("Are you sure you want to delete this event?", function(conf) {
            if(conf) {
				Meteor.call('events.remove', thisEvent._id);
            }
        });
    },  

});


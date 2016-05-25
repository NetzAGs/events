import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_admin.helpers({
	event() {
        return Events.findOne({_id: FlowRouter.getParam('_id')});
	},
    tasks() {
        return Tasks.find({eventId: FlowRouter.getParam('_id')});
    }
});

Template.Events_admin.events({
    'click .event-delete': function(event) {
        event.preventDefault();
        bootbox.confirm("Are you sure you want to delete this event?", function(conf) {
            if(conf) {
                let eventId = FlowRouter.getParam('_id');
                Events.remove({_id: eventId});
                Tasks.remove({eventId: eventId});
                Slots.remove({eventId: eventId});
                Volunteers.remove({'slot.eventId': eventId});
                FlowRouter.go('events.list');
            }
        });
        return false;
    },
    'click .event-close': function(event) {
        event.preventDefault();
        bootbox.confirm("Are you sure you want to close this event? It will no longe be listed in the events list!", function(conf) {
            if(conf) {
                let eventId = FlowRouter.getParam('_id');
                Events.update({_id: eventId}, {$set: {closed: true}});
                FlowRouter.go('events.list');
            }
        });
        return false;
    },
    'submit form.event-modify': function(event) {
        event.preventDefault();
        //
    }
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_admin.helpers({
	event() {
        return Events.findOne({_id: FlowRouter.getParam('_id')});
	},
    tasks() {
        return Tasks.find({eventId: FlowRouter.getParam('_id')});
    },
    eventadmins() {
        return Roles.getUsersInRole('event_admin', FlowRouter.getParam('_id'));
    },
    autocompleteSettings() {
        return {
            position: 'bottom',
            limit: 5,
            rules: [{
                collection: Meteor.users,
                field: 'profile.name',
                template: Template.Autocomplete_user_item
            }]
        };
    }
});

Template.Events_admin.events({
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
    },
    'autocompleteselect #event-admin-select': function(event, template, doc) {
        event.target.value = "";
        let eventId = FlowRouter.getParam('_id');
        console.log("events.makeadmin", doc._id, eventId);
        Meteor.call('events.makeadmin', doc._id, eventId);
    }
});

Template.Event_admin_list_item.events({
    'click .event-admin-remove'(event) {
        let thisUser = this;
		let eventId = FlowRouter.getParam('_id');
        bootbox.confirm("Really remove " + this.profile.name + " from the event admin list?", function(resp) {
            if(resp) {
                Meteor.call('events.removeadmin', thisUser._id, eventId);
            }
        });
    }
});

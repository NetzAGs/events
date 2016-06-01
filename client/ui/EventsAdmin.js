import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_admin.helpers({
    event() {
        return Events.findOne({_id: FlowRouter.getParam('_id')});
    },
    eventPath() {
        const eventId = FlowRouter.getParam('_id');
        return FlowRouter.path('events.detail', {_id: eventId});
    },  

    tasks() {
        return Tasks.find({eventId: FlowRouter.getParam('_id')});
    },
    event_admins() {
        return Roles.getUsersInRole('event_admin', FlowRouter.getParam('_id'));
    },
    coordinators() {
        return Roles.getUsersInRole('coordinator', FlowRouter.getParam('_id'));
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
        const changedEvent = {
            title: event.target.eventTitle.value,
            date: new Date(event.target.eventDate.value),
            desc: {
                de: event.target.eventDescDe.value,
                en: event.target.eventDescEn.value
            },
            img: event.target.eventImg.value
        };
        const eventId = FlowRouter.getParam('_id');
        Meteor.call('events.update', eventId, changedEvent);
    },
    'autocompleteselect #event-admin-select': function(event, template, doc) {
        event.target.value = "";
        let eventId = FlowRouter.getParam('_id');
        Meteor.call('events.makeadmin', doc._id, eventId);
    },
    'autocompleteselect #coordinator-select': function(event, template, doc) {
        event.target.value = "";
        let eventId = FlowRouter.getParam('_id');
        Meteor.call('events.makecoordinator', doc._id, eventId);
    },
    'submit form.add-task'(event) {
        event.preventDefault();
        let eventId = FlowRouter.getParam('_id');
        let newTask = {
            title: {
                de: event.target.taskTitleDe.value,
                en: event.target.taskTitleEn.value,
            },
            eventId: eventId
        };
        event.target.taskTitleDe.value = "";
        event.target.taskTitleEn.value = "";
        Meteor.call('tasks.insert', newTask);
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
Template.Coordinator_list_item.events({
    'click .coordinator-remove'(event) {
        let thisUser = this;
        let eventId = FlowRouter.getParam('_id');
        bootbox.confirm("Really remove " + this.profile.name + " from the coordinator list?", function(resp) {
            if(resp) {
                Meteor.call('events.removecoordinator', thisUser._id, eventId);
            }
        });
    }
});

Template.Event_tasks_list_item.events({
    'click .event-task-admin'(event) {
        FlowRouter.go('tasks.admin', {_id: this._id});
    },
    'click .event-task-remove'(event) {
        let thisTask = this;
        bootbox.confirm("Remove " + this.title.en + "?", function(resp) {
            if(resp) {
                Meteor.call('tasks.remove', thisTask._id);
            }
        });
    }
});


import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_contact.helpers({
    event() {
        const taskId = FlowRouter.getParam('_id');
        const task = Tasks.findOne({_id: taskId});
        try {
            return Events.findOne({_id: task.eventId});
        }
        catch(e) {
            return "";
        }
    },  
    eventPath() {
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        try {
            return FlowRouter.path('events.detail', {_id: task.eventId});
        }
        catch(e) {
            return "";
        }
    },
    task() {
        const taskId = FlowRouter.getParam('_id');
        return Tasks.findOne({_id: taskId});
    }
});

Template.Tasks_contact.events({
    'submit form.taskContact'(event) {
        event.preventDefault();
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        let msg = {
            subject: event.target.taskContactTitle.value,
            text: event.target.taskContactText.value
        };
        Meteor.call('tasks.contact', taskId, msg, function(err, res) {
            if(err) {
                bootbox.alert("Error sending Mail: " + err.error);
            } else {
                bootbox.alert("Mail sent!", function() {
                    FlowRouter.go("events.detail", {_id: task.eventId});
                });
            }
        });
    }
});

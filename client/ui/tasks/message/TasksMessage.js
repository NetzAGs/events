import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_message.helpers({
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
    },
    slots() {
        const taskId = FlowRouter.getParam('_id');
        return Slots.find({taskId: taskId}, {sort: {startTime: 1}});
    }
});

Template.Tasks_message.events({
    'change [type=checkbox]'(event) {
        let toggle = $(event.target).is(":checked");
        if($(event.target).hasClass("task-msg-all")) {
            $(".recipients-list :checkbox").prop("checked", toggle);
        } else if(!toggle) {
            $(".recipients-list .task-msg-all").prop("checked", false);
        }
    },
    'submit form.sendTaskMessage'(event) {
        event.preventDefault();
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        let msg = {
            subject: {
                de: event.target.taskMsgTitleDe.value,
                en: event.target.taskMsgTitleEn.value
            },
            body: {
                de: event.target.taskMsgDe.value,
                en: event.target.taskMsgEn.value
            },
            slotIds: $(event.target).find(".task-msg-slot:checked").map(function() { return $(this).data('slotid'); }).get(),
            sendToTaskadmins: $(event.target).find(".task-msg-taskadmins").is(":checked")
        };
        Meteor.call('messages.send', taskId, msg, function(err, res) {
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

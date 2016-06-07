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

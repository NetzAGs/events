import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_admin.helpers({
    event() {
        const taskId = FlowRouter.getParam('_id');
        const task = Tasks.findOne({_id: taskId});
        return Events.findOne({_id: task.eventId});
    },
    task() {
        const taskId = FlowRouter.getParam('_id');
        return Tasks.findOne({_id: taskId});
    },
    hasPermission() {
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        let perm = false;
        // dirty workaround against exception
        try {
            perm = (Roles.userIsInRole(Meteor.userId(), ['task_admin'], taskId) || Roles.userIsInRole(Meteor.userId(), ['system_admin', 'event_admin'], task.eventId));
        } catch(e) {
            perm = false;
        }
        return perm;
    },
    slots() {
        const taskId = FlowRouter.getParam('_id');
        return Slots.find({taskId: taskId}, {sort: {startTime: 1}});
    },
    taskadmins() {
        return Roles.getUsersInRole('task_admin', FlowRouter.getParam('_id'));
    },
    eventPath() {
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        return FlowRouter.path('events.detail', {_id: task.eventId});
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

Template.Tasks_admin.events({
    'autocompleteselect #task-admin-select': function(event, template, doc) {
        event.target.value = "";
        let taskId = FlowRouter.getParam('_id');
        Meteor.call('tasks.makeadmin', doc._id, taskId);
    },
    'submit form.task-modify': function(event) {
        event.preventDefault();
        const changedTask = { 
            title: {
                de: event.target.taskTitleDe.value,
                en: event.target.taskTitleEn.value
            },
            desc: {
                de: event.target.taskDescDe.value,
                en: event.target.taskDescEn.value
            },
            img: event.target.taskImg.value
        };
        const taskId = FlowRouter.getParam('_id');
        Meteor.call('tasks.update', taskId, changedTask);
    },  
    'submit form.create-slot': function(event) {
        event.preventDefault();
        const taskId = FlowRouter.getParam('_id');
        let task = Tasks.findOne({_id: taskId});
        let startMom = moment(event.target.slotStartTime.value);
        let endMom = moment(event.target.slotStartTime.value);
        endMom.add(moment.duration(event.target.slotDuration.value));
        let slotString = startMom.format('H:mm') + " - " + endMom.format('H:mm');
        let newSlot = {
            taskId: taskId,
            eventId: task.eventId,
            title: {
                en: task.title.en + " " + slotString,
                de: task.title.de + " " + slotString
            },
            startTime: startMom.toDate(),
            endTime: endMom.toDate(),
            allday: false,
            mincap: parseInt(event.target.slotMincap.value),
            maxcap: parseInt(event.target.slotMincap.value) + parseInt(event.target.slotBuffer.value),
            curcount: 0,
            curcap: parseInt(event.target.slotMincap.value),
        };
        Meteor.call('slots.insert', newSlot);
    }
});

Template.Task_admin_list_item.events({
    'click .task-admin-remove'(event) {
        let thisUser = this;
        let taskId = FlowRouter.getParam('_id');
        bootbox.confirm("Really remove " + this.profile.name + " from the task admin list?", function(resp) {
            if(resp) {
                Meteor.call('tasks.removeadmin', thisUser._id, taskId);
            }
        });
    }
});

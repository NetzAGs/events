import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_admin.helpers({
    eventadmins() {
        return Roles.getUsersInRole('task_admin', FlowRouter.getParam('_id'));
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

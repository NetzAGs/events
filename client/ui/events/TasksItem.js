import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_item.helpers({
	hasPermission() {
		let task = Tasks.findOne({_id: this.task._id});
		let perm = false;
//FIXME
		// dirty workaround against exception
		try {
			perm = (Roles.userIsInRole(Meteor.userId(), ['task_admin'], this.task._id) || Roles.userIsInRole(Meteor.userId(), ['system_admin', 'event_admin'], task.eventId));
		} catch(e) {
			perm = false;
		}
		return perm;
	},
	slots() {
		return Slots.find({taskId: this.task._id}, {sort: {startTime: 1}});
	}
});

Template.Tasks_item.events({
    'click .task-admin'(event) {
        event.preventDefault();
        FlowRouter.go('tasks.admin', this.task);
    },
    'click .task-volunteers'(event) {
        event.preventDefault();
        FlowRouter.go('tasks.volunteers', this.task);
    },
    'click .task-message'(event) {
        event.preventDefault();
        FlowRouter.go('tasks.message', this.task);
    }
});

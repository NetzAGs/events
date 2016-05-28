import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_item.helpers({
	hasPermission() {
		const taskId = this._id;
		let task = Tasks.findOne({_id: taskId});
		let perm = false;
//FIXME
		// dirty workaround against exception
		try {
			perm = (Roles.userIsInRole(Meteor.userId(), ['task_admin'], taskId) || Roles.userIsInRole(Meteor.userId(), ['system_admin', 'event_admin'], task.eventId));
		} catch(e) {
			perm = false;
		}
		return perm;
	},
	slots() {
		return Slots.find({taskId: this._id}, {sort: {startTime: 1}});
	}
});

Template.Tasks_item.events({
    'click .task-admin'(event) {
        event.preventDefault();
        FlowRouter.go('tasks.admin', this);
    },
    'click .task-checkin'(event) {
        event.preventDefault();
        FlowRouter.go('tasks.volunteers', this);
    }
});

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
    taskAdminMailto() {
        let mailto = "mailto:";
        mailto += "foo@bar.de";
        return mailto;
    },
	slots() {
		return Slots.find({taskId: this.task._id}, {sort: {startTime: 1}});
	}
});

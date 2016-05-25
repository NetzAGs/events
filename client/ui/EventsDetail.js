import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_detail.helpers({
	event() {
        return Events.findOne({_id: FlowRouter.getParam('_id')});
	},
    tasks() {
        return Tasks.find({eventId: FlowRouter.getParam('_id')});
    },
    topSlots() {
        const lim = 6;
        return Slots.find({eventId: FlowRouter.getParam('_id'), curcap: {$gt: 0}}, {sort: {curcap: -1}, limit: lim});
    },
    mySlots() {
        return Volunteers.find({userId: Meteor.userId(), 'slot.eventId': FlowRouter.getParam('_id')}, {sort: {'slot.startTime': 1}});
    }
});

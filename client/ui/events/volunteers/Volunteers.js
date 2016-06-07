import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Volunteers.helpers({
    btnclass(dorm) {
        let dormParam = FlowRouter.getParam('dorm');
        if(dormParam) {
            if(dormParam == dorm) {
                return "btn-primary";
            }
        } else {
            if(dorm == "all") {
                return "btn-primary";
            }
        }
        return "btn-default";
    },
    dorm() {
        return FlowRouter.getParam('dorm');
    },
    event() {
        let eventId = FlowRouter.getParam('_id');
        console.log("hi", eventId);
        return Events.findOne({_id: eventId});
    },
    volunteers() {
        let eventId = FlowRouter.getParam('_id');
        let dorm = FlowRouter.getParam('dorm');
        let userIds = Volunteers.find({'slot.eventId': eventId}).map(function(vol) { return vol.userId; });
        if(dorm) {
            return Meteor.users.find({_id: {$in: userIds}, 'profile.dorm': dorm}, {sort: {'profile.room': 1}});
        } else {
            return Meteor.users.find({_id: {$in: userIds}}, {sort: {'profile.name': 1}});
        }
    }
});

Template.Volunteers.events({
    'click .select-dorm'(event) {
        event.preventDefault();
        let eventId = FlowRouter.getParam('_id');
        if(event.target.dataset.dorm) {
            FlowRouter.go('events.volunteers.dorm', {_id: eventId, dorm: event.target.dataset.dorm});
        } else {
            FlowRouter.go('events.volunteers', {_id: eventId});
        }
    }
});

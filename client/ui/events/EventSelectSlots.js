import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Events_select_slots.helpers({
    tasks() {
        return Tasks.find({eventId: this.selevent._id});
    },
    topSlots() {
        const lim = 6;
        return Slots.find({eventId: this.selevent._id, curcap: {$gt: 0}}, {sort: {curcap: -1}, limit: lim});
    },
    mySlots() {
        let slotIds = Volunteers.find({userId: this.user._id, 'slot.eventId': this.selevent._id}).map(function(vol) { return vol.slot._id; });
        return Slots.find({_id: {$in: slotIds}}, {sort: {startTime: 1}});
    }
});

Template.Events_detail.events({
    'click .event-delete': function(event) {
        event.preventDefault();
        const eventId = this.selevent._id;
        bootbox.confirm("Are you sure you want to delete this event?", function(conf) {
            if(conf) {
                Meteor.call('events.remove', eventId);
                FlowRouter.go('events.list');
            }
        });
    },
});

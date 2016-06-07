import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Slots_item.onCreated(function() {
});

Template.Slots_item.helpers({
    disabled() {
        let taken = Volunteers.findOne({
            userId: this.uid,
            'slot._id': this.slot._id
        });
        if(taken) {
            return false;
        }
        let overlap = Volunteers.findOne({
            userId: this.uid,
            'slot._id': {$ne : this.slot._id},
            'slot.allday': false,
            'slot.endTime': {$gt: this.slot.startTime},
            'slot.startTime': {$lt: this.slot.endTime}
        });
        if(overlap) {
            // user has different slot with time overlap
            return true;
        } else {
            if(this.slot.curcount >= this.slot.maxcap) {
                // slot is full and not taken by user
                return true;
            }
            return false;
        }
    },
    checked() {
        if(Volunteers.findOne({userId: this.uid, 'slot._id': this.slot._id})) {
            return true;
        } else {
            return false;
        }
    }
});

Template.Slots_item.events({
    'change [type=checkbox]'(event) {
        const checked = $(event.target).is(':checked');
        Meteor.call('slots.volunteer', this.uid, this.slot._id, checked, this.temp);
    }
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Slots_item.onCreated(function() {
    console.log("onCreated:", this);
});

Template.Slots_item.helpers({
    disabled() {
        let taken = Volunteers.findOne({
            userId: Meteor.userId(),
            'slot._id': {$ne : this._id},
            'slot.allday': false,
            'slot.endTime': {$gt: this.startTime},
            'slot.startTime': {$lt: this.endTime}
        });
        if(taken) {
            // user has different slot with time overlap
            return true;
        } else {
            if(this.curcount >= this.maxcap) {
                // slot is full and not taken by user
                return true;
            }
            return false;
        }
    },
    checked() {
        if(Volunteers.findOne({userId: Meteor.userId(), 'slot._id': this._id})) {
            return true;
        } else {
            return false;
        }
    }
});

Template.Slots_item.events({
    'change [type=checkbox]'(event) {
        const checked = $(event.target).is(':checked');
        if(checked) {
            Volunteers.insert({userId: Meteor.userId(), slot: this, checkedIn: 0});
            Slots.update({_id: this._id}, {$inc: {curcap: -1, curcount: 1}});
        } else {
            let old = Volunteers.findOne({userId: Meteor.userId(), 'slot._id': this._id});
            if(old) {
                Volunteers.remove({_id: old._id});
                Slots.update({_id: this._id}, {$inc: {curcap: 1, curcount: -1}});
            } else {
                return false;
            }
        }
    }
});

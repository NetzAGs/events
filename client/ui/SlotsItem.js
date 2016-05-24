import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

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
            return true;
        } else {
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
            Volunteers.insert({userId: Meteor.userId(), slot: this});
        } else {
            let old = Volunteers.findOne({userId: Meteor.userId(), 'slot._id': this._id});
            if(old) {
                Volunteers.remove({_id: old._id});
            } else {
                return false;
            }
        }
    }
});

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_slot_volunteers.helpers({
    volunteers() {
        /*
        let userIds = [];
        Volunteers.find({'slot._id': this._id}).forEach(function(vol) {
            userIds.push(vol.userId);
        });
        return Meteor.users.find({_id: {$in: userIds}}, {sort: {'profile.name': 1}});
        */
        return Volunteers.find({'slot._id': this._id});
    }
});

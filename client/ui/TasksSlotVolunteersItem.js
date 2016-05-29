import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_slot_volunteers_item.helpers({
    user() {
        return Meteor.users.findOne({_id: this.volunteer.userId});
    }
});

Template.Tasks_slot_volunteers_item.events({
    'change [type=checkbox]'(event) {
        const checked = $(event.target).is(':checked');
        Meteor.call('volunteers.checkin', this.volunteer._id, checked);
    }
});


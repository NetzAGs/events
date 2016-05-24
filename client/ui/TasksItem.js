import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Tasks_item.helpers({
    slots() {
        return Slots.find({taskId: this._id}, {sort: {startTime: 1}});
    }
});


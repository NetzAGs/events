import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Recruit.helpers({
    events() {
        return Events.find({closed: false,_id: {$in: Roles.getGroupsForUser(Meteor.userId(), "coordinator")}});
    },
    newuser() {
        const userId = FlowRouter.getParam('_id');
        let user = Meteor.users.findOne({_id: userId});
        if(user) {
            return {user: user, temp: false};
        } else {
            return {user: {_id: userId}, temp: true};
        }
    }
});

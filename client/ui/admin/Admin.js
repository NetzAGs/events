import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Admin.helpers({
    systemadmins() {
        return Roles.getUsersInRole('system_admin');
    },
    autocompleteSettings() {
        return {
            position: 'bottom',
            limit: 25,
            rules: [{
                collection: Meteor.users,
                field: 'profile.name',
                template: Template.Autocomplete_user_item
            }]
        };
    }
});

Template.Admin.events({
    'submit form.addEvent': function(event) {
        event.preventDefault();
        let newEvent = {
            _id: event.target.eventId.value,
            title: event.target.eventTitle.value,
            date: event.target.eventDate.value,
            desc: {de: "", en: ""},
            closed: false,
            img: ""
        };
        Meteor.call('events.insert', newEvent);
        FlowRouter.go('events.list');
    },
    'autocompleteselect #adminselect': function(event, template, doc) {
        event.target.value = "";
        Meteor.call('system.makeadmin', doc._id);
    }
});

Template.System_admin_list_item.events({
    'click .system-admin-remove'(event) {
        let thisUser = this;
        bootbox.confirm("Really remove " + this.profile.name + " from the admin list?", function(resp) {
            if(resp) {
                Meteor.call('system.removeadmin', thisUser._id);
            }
        });
    }
});

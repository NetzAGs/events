import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Admin.helpers({
    systemadmins() {
        console.log("hi systemadmins");
        return Roles.getUsersInRole('system_admin');
    },
    settings() {
        console.log("hi settings");
        return {
            position: 'bottom',
            limit: 5,
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
            img: ""
        };
        if(Events.findOne({_id: newEvent._id})) {
            alert("ID " + newEvent._id + " already taken!");
            return;
        }
        Events.insert(newEvent);
        FlowRouter.go('events.list');
    },
    'autocompleteselect #adminselect': function(event, template, doc) {
        console.log("selected user:", doc);
        event.target.value = "";
        // FIXME to server code
        Roles.addUsersToRoles(doc, 'system_admin', Roles.GLOBAL_GROUP);
    }
});

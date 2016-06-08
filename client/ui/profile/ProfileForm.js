import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.Profile_form.events({
    'submit form.profile'(event) {
        event.preventDefault();
        let u = {
            email: event.target.email.value,
            profile: {
                name: event.target.name.value,
                phone: event.target.phone.value,
                dorm: event.target.dorm.value,
                room: event.target.room.value,
                lang: event.target.lang.value
            },
        };
        Meteor.call('users.update', this.user._id, u, function(err, ret) {
            if(err) {
                bootbox.alert(err.error);
            } else if(ret) {
                //FlowRouter.go('recruit.user', {_id: ret});
                bootbox.dialog({
                    message: (Meteor.user().profile.lang == "de" ? "Neuer Helfer erfolgreich eingetragen!" : "Successfully added new volunteer!"),
                    title: "",
                    buttons: {
                        modify: {
                            label: (Meteor.user().profile.lang == "de" ? "Ändern" : "Modify"),
                            className: "btn-warning",
                            callback: function() {
                                FlowRouter.go('recruit.user', {_id: ret});
                            }
                        },
                        next: {
                            label: (Meteor.user().profile.lang == "de" ? "Nächster Helfer" : "Next volunteer"),
                            className: "btn-success",
                            callback: function() {
                                FlowRouter.go('recruit');
                            }
                        }
                    }
                });
            }
        });
    }
});

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
        Meteor.call('users.update', this.thisuser._id, u, function(err, ret) {
            if(err) {
                bootbox.alert(err.error);
            }
        });
    }
});

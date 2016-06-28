FlowRouter.route('/', {
    name: 'root',
    action() {
        //BlazeLayout.render('App_body', {main: 'Events_list'});
        FlowRouter.go('events.list');
    }
});

FlowRouter.route('/events', {
    name: 'events.list',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_list'});
    }
});

FlowRouter.route('/events/:_id', {
    name: 'events.detail',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_detail'});
    }
});

FlowRouter.route('/admin', {
    name: 'system.admin',
    action() {
        BlazeLayout.render('App_body', {main: 'Admin'});
    }
});

FlowRouter.route('/admin/:_id', {
    name: 'events.admin',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_admin'});
    }
});

FlowRouter.route('/tasks/:_id/admin', {
    name: 'tasks.admin',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_admin'});
    }
});

FlowRouter.route('/tasks/:_id/volunteers', {
    name: 'tasks.volunteers',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_volunteers'});
    }
});

FlowRouter.route('/tasks/:_id/message', {
    name: 'tasks.message',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_message'});
    }
});

FlowRouter.route('/tasks/:_id/contact', {
    name: 'tasks.contact',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_contact'});
    }
});

FlowRouter.route('/events/:_id/volunteers', {
    name: 'events.volunteers',
    action() {
        BlazeLayout.render('App_body', {main: 'Volunteers'});
    }
});

FlowRouter.route('/events/:_id/volunteers/:dorm', {
    name: 'events.volunteers.dorm',
    action() {
        BlazeLayout.render('App_body', {main: 'Volunteers'});
    }
});

FlowRouter.route('/events/:_id/message', {
    name: 'events.message',
    action() {
        BlazeLayout.render('App_body', {main: 'Events_message'});
    }
});

FlowRouter.route('/recruit', {
    name: 'recruit',
    action() {
        FlowRouter.go('recruit.user', {_id: Random.id()});
    }
});
FlowRouter.route('/recruit/:_id', {
    name: 'recruit.user',
    action() {
        BlazeLayout.render('App_body', {main: 'Recruit'});
    }
});

FlowRouter.route('/profile', {
    name: 'profile',
    action() {
        BlazeLayout.render('App_body', {main: 'Profile_page'});
    }
});

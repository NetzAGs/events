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

FlowRouter.route('/tasks/admin/:_id', {
    name: 'tasks.admin',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_admin'});
    }
});

FlowRouter.route('/tasks/volunteers/:_id', {
    name: 'tasks.volunteers',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_volunteers'});
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

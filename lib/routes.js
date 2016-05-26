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

FlowRouter.route('/tasks/:_id', {
    name: 'tasks.admin',
    action() {
        BlazeLayout.render('App_body', {main: 'Tasks_admin'});
    }
});

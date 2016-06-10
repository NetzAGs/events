import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Template.registerHelper('inputDate', function(date) {
    if(date) {
        return moment(date).format("YYYY-MM-DD");
    } else {
        return "";
    }
});

Template.registerHelper('displayDate', function(date) {
    if(date) {
        return moment(date).format("D.M.YYYY");
    } else {
        return "";
    }
});

Template.registerHelper('fmtdatetime', function(date) {
    if(date) {
        console.log("fmtdatetime", moment(date).format("YYYY-MM-DD[T]HH:mm"));
        return moment(date).format("YYYY-MM-DD[T]HH:mm");
        //console.log("fmtdatetime:", moment(date).toISOString());
        //return moment(date).toISOString();
    } else {
        return "";
    }
});

Template.registerHelper('lang', function(de, en) {
    if(Meteor.user().profile.lang && Meteor.user().profile.lang == "de") {
        return de;
    }
    return en;
});

Template.registerHelper('diff', function(a, b) {
    return a - b;
});

Template.registerHelper('optionSelectedEq', function(opt, val, text) {
    return '<option value="'+opt+'" '+(opt==val?' selected':'')+'>'+text+'</option>';
});

Template.registerHelper('selected', function(opt, val, val2) {
    if(val) {
        return opt == val ? 'selected' : '';
    } else {
        return opt == val2 ? 'selected' : '';
    }
});

Template.registerHelper('isModNotFirst', function(a, b) {
    return (a != 0 && a % b == 0);
});

Template.registerHelper('chunksOf', function(col, n) {
    let ret = [];
    let cur = [];
    let i = 0;
    col.forEach(function(el) {
        cur.push(el);
        if(++i == n) {
            ret.push(cur);
            i = 0;
            cur = [];
        }
    });
    if(i) {
        ret.push(cur);
    }
    return ret;
});

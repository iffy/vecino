import ReactDOM from 'react-dom';
import _ from 'lodash';

var pre_render_funcs = [];
var render_funcs = [];
var post_render_funcs = [];
var INRENDER = false;

function maybeFunc(x) {
    if (_.isFunction(x)) {
        return x
    } else {
        return function() {
            return x;
        }
    }
}

//
// Register a function to be called prior to rendering
//
function beforeRender(func) {
    pre_render_funcs.push(func);
}

//
// Register a component and element to be rendered with React
//
function registerReactRendering(component, elem) {
    component = maybeFunc(component);
    elem = maybeFunc(elem);
    render_funcs.push(function() {
        return new Promise((resolve, reject) => {
            ReactDOM.render(component(), elem(), function() {
                resolve(true);
            });
        });
    });
}

function registerSyncRenderFunc(func) {
    render_funcs.push(function() {
        func();
        return Promise.resolve(true);
    });
}

//
// Register a function to be called after rendering
//
function afterRender(func) {
    post_render_funcs.push(func);
}

function doRender() {
    if (INRENDER) {
        return;
    }
    INRENDER = true;
    _.each(pre_render_funcs, function(func) {
        func();
    });
    var promises = _.map(render_funcs, function(func) {
        return func();
    });
    return Promise.all(promises).then(function() {
        _.each(post_render_funcs, function(func) {
            func();
        });
        INRENDER = false;
    });
}



var pre_update_funcs = [];
var post_update_funcs = [];
var INUPDATE = false;
var update_queue = [];

//
// Register a function to be called prior to each update round
//
function beforeUpdate(func) {
    pre_update_funcs.push(func);
}

//
// Register a function to be called after each update round
//
function afterUpdate(func) {
    post_update_funcs.push(func);
}

//
// Run a function, then re-render
//
function doUpdate(func) {
    if (func) {
        update_queue.push(func);
    }
    if (INUPDATE) {
        return;
    }
    INUPDATE = true;
    _.each(pre_update_funcs, function(func) {
        func();
    });
    while (update_queue.length) {
        update_queue.shift()();
    }
    INUPDATE = false;

    _.each(post_update_funcs, function(func) {
        func();
    });
    return doRender();
}

// Register a function to be called every time a value changes
// Function will be called with (obj, attr, oldval, newval)
let value_changers = [];
function onValueChange(func) {
    value_changers.push(func);
}

//
// A generic onChange handler
//
function onChange(obj, attr) {
  return function(newval) {
    if (newval.nativeEvent && newval.bubbles) {
      // This is probably a React SyntheticEvent
      newval = newval.target.value;
    }
    let old_value = obj[attr];
    doUpdate(() => {
      obj[attr] = newval;
    })
    if (old_value !== newval) {
        _.each(value_changers, func => {
            try {
                func(obj, attr, old_value, newval);
            } catch(err) {
                console.error("Swallowing onValueChange error:", err);
            }
        })
    }
  }
}

module.exports = {
    beforeUpdate,
    afterUpdate,
    doUpdate,
    beforeRender,
    afterRender,
    doRender,
    registerReactRendering,
    registerSyncRenderFunc,
    onChange,
    onValueChange,
};

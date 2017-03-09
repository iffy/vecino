import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const Path = require('path');
const cx = require('classnames'); 
const yaml = require('js-yaml');

const {TextInput, SelectInput} = require('./input/input.jsx');
const {registerSyncRenderFunc, registerReactRendering, doRender, doUpdate, onChange, onValueChange} = require('./render.jsx');
const {HouseholdsEditor} = require('./people.jsx');

//-------------------------------------------------------------
// Global state
//-------------------------------------------------------------
let STATE = {
  households: [],
};

//-------------------------------------------------------------
// Notification manager
//-------------------------------------------------------------
let notifications = [];
function notify(message, cls) {
  cls = cls || '';
  doUpdate(() => {
    notifications.push([message, cls]);
  })
  setTimeout(() => {
    doUpdate(() => {
      notifications.shift();
    });
  }, 8000);
} 
let Notifier = React.createClass({
  render: function() {
    let messages = _.map(notifications, (item, idx) => {
      let msg = item[0];
      let cls = item[1];
      cls = {
        'notification': true
      }
      cls[item[1]] = true;
      cls = cx(cls);
      return (<div className={cls} key={idx}>{msg}</div>);
    })
    return (<div className="notifications">
      {messages}
      </div>);
  }
})


//-------------------------------------------------------------
// Rendering
//-------------------------------------------------------------
registerReactRendering(() => {
  return (<div>
    <HouseholdsEditor households={STATE.households} />
    <Notifier notifications={notifications}/>
  </div>);
}, () => {
  return document.getElementById('content');
});


//-------------------------------------------------------------
// LHTML interaction
//-------------------------------------------------------------
LHTML.saving.disableFormSync();
LHTML.saving.onBeforeSave = () => {
  let promises = [];
  promises.push(LHTML.fs.writeFile('households.yml',
    yaml.safeDump(STATE.households)));
  return Promise.all(promises);
};

// Mark the document as changed when it's changed.
onValueChange((obj, attr, oldval, newval) => {
  LHTML.saving.setDocumentEdited(true);
})

LHTML.on('saved', () => {
  notify('Changes saved');
})
LHTML.on('save-failed', () => {
  notify('Save failed', 'error');
})

let promises = [];
promises.push(LHTML.fs.readFile('households.yml', 'utf8')
  .then(content => {
    console.log('content', content);
    STATE.households = yaml.safeLoad(content);
    console.log('households', STATE.households);
  }))

Promise.all(promises)
.then(() => {
  doRender();
}, err => {
  console.error(err);
  doRender();
})


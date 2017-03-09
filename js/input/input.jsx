require('./input.css');
import React from 'react';
import {onChange, doUpdate} from '../render.jsx';


function joinclasses() {
  return _.filter(arguments).join(' ');
}

var TextInput = React.createClass({
  focus: function() {
    this.startEditing();
  },
  getInitialState: function() {
    return {
      editing: false,
      value: this.props.value,
    }
  },
  componentWillReceiveProps: function(nextProps) {
    if (this.props.iscurrency) {
      if (parseFloat(nextProps.value) === parseFloat(this.state.value)) {
        return;
      }
    }
    if (this.state.editing) {
      if (parseFloat(nextProps.value) === 0  && this.state.value === '') {
        // they want it blank
        return;
      }
    }
    this.setState({value: nextProps.value});
  },
  startEditing: function() {
    if (this.props.disabled) {
      return
    } else {
      this.setState({editing: true});  
    }
  },
  onChange: function(ev) {
    var value = this.props.islist ? ev.target.value.split('\n') : ev.target.value;
    this.setState({value: value}, () => {
      if (this.props.onChange) {
        this.props.onChange(value);
      }  
    });
  },
  onBlur: function(ev) {
    this.setState({editing: false});
    doUpdate(function() {

    });
  },
  render: function() {
    if (this.state.editing) {
      // Edit state
      var cls = joinclasses(this.props.className, 'like-surroundings');
      var note = null;
      if (this.props.note) {
        note = (<div className="click-to-edit-note">{this.props.note}</div>);
      }
      var attribs = {
        className: cls,
        placeholder: this.props.placeholder,
        onChange: this.onChange,
        onBlur: this.onBlur,
        ref: function(input) {
          if (input != null) {
            input.focus();
          }
        },
      }
      var elem;
      if (this.props.multiline) {
        // multiline
        var display_value = this.state.value;
        if (this.props.islist) {
          display_value = (this.state.value || []).join('\n');
        }
        
        var rows = (display_value || this.props.placeholder || '').split('\n');
        var nrows = rows.length;
        if (nrows < 1) {
          nrows = 1;
        }
        elem = (<textarea rows={nrows} {...attribs}>{display_value}</textarea>);
      } else {
        // single line
        var content_length = _.max([1, (this.state.value||'').length, (this.props.placeholder||'').length]);
        var size = content_length + 2;
        elem = (<input type="text" size={size} value={this.state.value} {...attribs} />);
      }
      return (
        <span className="click-to-edit-container">
          {note}
          {this.props.prefix}{elem}{this.props.suffix}
        </span>);
    } else {
      // View state
      var cls = joinclasses(this.props.className, 'click-to-edit', 'display');
      var value = this.state.value;
      if (this.props.islist) {
        value = (this.state.value || []).join('\n');
      }
      var prefix;
      var suffix;
      if (_.isUndefined(value) || _.isNull(value) || value === '') {
        value = this.props.placeholder;
        cls = joinclasses(cls, 'empty');
      }
      
      prefix = this.props.prefix ? (<span>{this.props.prefix}</span>) : null;
      suffix = this.props.suffix ? (<span>{this.props.suffix}</span>) : null;
      if (this.props.multiline) {
        cls = joinclasses(cls, 'multiline');
      }
      if (this.props.iscurrency) {
        value = formatDecimal(value);
      }

      return (<span tabIndex="0" className={cls} onDoubleClick={this.startEditing} onClick={this.startEditing} onFocus={this.startEditing}>{prefix}{value}{suffix}</span>);
    }
  }
});

var SelectInput = React.createClass({
  render: function() {
    var cls = joinclasses(this.props.className, 'like-surroundings')
    return (<span><select {...this.props} className={cls}>{this.props.children}</select></span>);
  }
});

module.exports = {TextInput, SelectInput};
require('./people.css');
import React from 'react';
import _ from 'lodash';

const {doUpdate, onChange} = require('./render.jsx');
const {TextInput} = require('./input/input.jsx');
const {pseudoUUID} = require('./util.jsx');


let HouseholdsEditor = React.createClass({
  render: function() {
    let households = _(this.props.households)
      .sortBy((hh,idx) => {
        return [hh.name, idx];
      })
      .map((hh,idx) => {
        return (<HouseholdEditor household={hh} key={hh.id} />);
      })
      .value();
    return (
      <div>
        <h1>Households</h1>
        <div>
          <button onClick={this.addHousehold}>Add household</button>
        </div>
        <div className="household-list">
          {households}
        </div>
      </div>);
  },
  addHousehold: function() {
    doUpdate(() => {
      this.props.households.push({
        id: pseudoUUID(),
        members: [],
      });
    });
  }
})

let HouseholdEditor = React.createClass({
  render: function() {
    let hh = this.props.household;
    let members = _(hh.members)
      .sortBy((member, idx) => {
        return [member.head, idx];
      })
      .map((member) => {
        return (<PersonEditor person={member} />);
      })
      .value();
    return (<div className="household">
      <div><TextInput
        placeholder="<household name>"
        value={hh.name}
        onChange={onChange(hh, 'name')} />
      </div>
      <table className="keyvalue">
        <tr>
          <th>Family Phone</th>
          <td>
            <TextInput
              placeholder="000-000-0000"
              value={hh.phone}
              onChange={onChange(hh, 'phone')}
            />
          </td>
        </tr>
        <tr>
          <th>Address</th>
          <td>
            <TextInput
              placeholder="<address>"
              value={hh.address}
              onChange={onChange(hh, 'address')}
            />
          </td>
        </tr>
        <tr>
          <th>Physician</th>
          <td>
            <TextInput
              placeholder="<physician>"
              value={hh.physician}
              onChange={onChange(hh, 'physician')}
            />
          </td>
        </tr>
        <tr>
          <th>Out of State Contact</th>
          <td>
            <TextInput
              multiline
              placeholder="<out of state contact>"
              value={hh.out_of_state_contact}
              onChange={onChange(hh, 'out_of_state_contact')}
            />
          </td>
        </tr>
      </table>
      <hr/>
      <div className="person-list">
        {members}
        <button onClick={this.addMember}>Add member</button>
      </div>
    </div>)
  },
  addMember: function() {
    doUpdate(() => {
      if (!this.props.household.members) {
        this.props.household.members = [];
      }
      this.props.household.members.push({
        id: pseudoUUID(),
      })
    });
  }
})

let PersonEditor = React.createClass({
  render: function() {
    let person = this.props.person;
    return (<div className="person">

        <div className="name">
          <TextInput
            placeholder="<name>"
            value={person.name}
            onChange={onChange(person, 'name')} />
        </div>
        <table className="keyvalue">
          <tr>
            <th>Short name:</th>
            <td><TextInput
              placeholder="<shortname>"
              value={person.shortname}
              onChange={onChange(person, 'shortname')} />
            </td>
          </tr>
          <tr>
            <th>Cell:</th>
            <td><TextInput
              placeholder="<cellphone>"
              value={person.cellphone}
              onChange={onChange(person, 'cellphone')} />
            </td>
          </tr>
          <tr>
            <th>Work:</th>
            <td><TextInput
              placeholder="<workphone>"
              value={person.workphone}
              onChange={onChange(person, 'workphone')} />
            </td>
          </tr>
        </table>
      </div>)
  }
})


module.exports = {HouseholdsEditor};
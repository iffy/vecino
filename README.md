# Building

Install node, npm and yarn

Install dependencies:

    yarn

Build once:

    make

Or watch and build as you develop:

    webpack -w


# Structure

`people.yml`

Household:

- name
- where they live on a map
- address
- family phone
- family email
- people:
- group:
- physician
- out_of_state_contact:
    last_updated: X

- last_updated

Person:

- cell phone
- work phone
- email
- skills:
  HAM
  CERT
  NEST
  SUTURING
- skills_last_updated: date

`groups.yml`

Group:

- name
- members


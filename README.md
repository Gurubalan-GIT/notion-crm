## Introduction

A Notion view that can render data from a Notion Database and perform complex functions extending Notion's out of the box features such as compound filters and sorting.

## Installation

- Install dependecies with _yarn_ : `yarn`
- Run the development server : `yarn dev`
- Run the production server : `yarn build && yarn start`
- To lint and test the codebase with linters : `yarn test-all`

## Disclaimer and things to keep in mind

### Design System

Ant Design is used here as the design system. **This is utilized strictly only for building the UI elements faster and all the logical features are written in-house.**

## Feature Pipeline

- [x] Build a table view UI for Notion databases

  - [x] Implement a basic table view given a Notion database as input.
  - [x] Support sorting.
  - [x] Support rearrangement and resizing of columns - expected behavior:
    - [x] Click and hold the column headings to drag them left or right.
    - [x] Resize columns by hovering over their edges, and dragging right or left.

- [x] Build a Notion filter UI for supporting database filters.

  - [x] Support the property types `checkbox , date , multi_select , number , rich_text ,
select , timestamp , status`.
  - [x] Support Compound filters with filter groups.
  - [x] The Notion API doc notes that it only supports two levels of nesting on compound filter conditions. Implement the filters such that the restriction on the levels of nesting is configurable e.g. could be increased to 3, 4, or more.
  - [ ] Implement unit tests for the Compound filters

- [ ] Implement the NOT operator for compound filter conditions. Support compound filter conditions that contain only filter operators where the Notion API offers the logical negation e.g. `!(   )` is `is_not_empty` , `!( less_than )` is `greater_than_or_equal_to`
  - [ ] For the filter conditions where Notion does not offer the logical negation, implement validation logic that prompts the user that the NOT operator is unsupported with the given compound filter conditions.
  - [ ] For example: `!(( datePropertyX is after “2023-01-01” AND textPropertyY ends with “.com”) OR textPropertyZ starts with “www.”)` should indicate “Unsupported conditions for `NOT: ends with , starts with`
  - [ ] Include unit test cases for the NOT operator logic

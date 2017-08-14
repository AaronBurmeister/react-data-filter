# react-data-filter

A logical React component for data filtering

[![NPM](https://nodei.co/npm/react-data-filter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/react-data-filter/)

## Table of contents
 - [Logical](#logical)
 - [React](#react)
 - [Passing children](#passing-children)
 - [Child properties](#child-properties)
 - [API](#api)
   - [\<DataFilter\>](#datafilter)

## Logical

This is a logical component. This means it won't ever render anything.
This allows you to create your UI as you need it. This is possible because all you need to control the filtering is passed
as properties to the underlying children.

## React

This package is to be used with React.
See [React](https://facebook.github.io/react/) for more details.

## Passing children

This package uses [react-resolve-element](https://npmjs.com/package/react-resolve-element) for passing children.

## Child properties

Your children will get following properties:

* **filters:array**

  An array of the filters.
  Each filter has the following fields:
    - `selectionKey:string`: the unique key of the selection which the filter uses
    - `options:array`: the possible filter options
    - `selection:array`: the currently selected filter options - this can be used to create controlled components (You can look into this [gist](https://gist.github.com/markerikson/d71cfc81687f11609d2559e8daee10cc) for more information on controlled and uncontrolled components)
    - `setSelection:function`: this function should be used to update the filter. It takes one argument, namely an array of the currently selected options
    - `...filterProps:any`: additional parameters which can be passed in `<DataFilter>`'s `filters` prop.

* **clearSelection:function**

  This function can be used to clear all currently set filters.

* **resetSelection:function**

  This function can be used to reset all currently set filters to the `selections` prop.

* **data:array**

  The filtered data.

* **...ownProps:any**

  Additional properties set to `<DataFilter>` will be passed as well.

## API

### \<DataFilter\>

Takes the provided data, filters it according to the provided filters and passes it to the children.

```JSX
import DataFilter from 'react-data-filter';

<DataFilter
  data={[
    dataEntry,
    ...
  ]}
  filters={[
    {
      selectionKey: string,
      resolveValue: (dataEntry) => filterValue,
      ...filterProps,
      // optional:
      match: (selection, value) => boolean,
    },
    ...
  ]}
  allowEmptyFilters={boolean}
  combineFilters={(sum, filterResult) => boolean}
  selections={{
    selectionKey: [ selectedOption, ... ],
    ...
  }}

  component={ReactComponent}
  render={(ownProps) => ReactNode}

  {...ownProps}
>
  {ReactNode}
</DataFilter>
```

#### Properties

* **data:array**

  The data which should be filtered.
  The entries can be of any type.

* **filters:array**

  The filter specifications.
  A filter should specify a `selectionKey`. This is the unique key of the selection which the filter should use. If two filters have the same selectionKey, they share the same selection. This can become useful if you have one control which controls multiple filters.
  It also needs a `resolveValue` function which resolves the value from a data entry which should be used for filtering.
  You can optionally pass the `match` function which compares the selection with the value resolved by `resolveValue`. If not specified, this function defaults to lodash's `includes` function which checks if the value is equal to one of the selected options.
  You can also pass your own properties as these will be passed to the underlying children and can be useful for the rendering of the filter controls.
  See [Child properties](#child-properties) for more details.

* **allowEmptyFilters:boolean**

  Specifies whether filters with no options should not be ignored.

* **combineFilters(sum, filterResult):boolean**

  This function specifies how the relation between filters should be managed.
  It is used to match the result of a filter with the other filters results.
  It gets called for each filter in order to reduce their result into a single `boolean`.

  `sum` is set to `undefined` for the first filter to be checked. For all other filters the value is the result of the already combined filters.

  `filter` is set to `undefined` if the filter has no selection. Otherwise it is set to the result of the filter (`true` if matched, `false` otherwise).

  The default value is `(sum = true, filter = true) => sum && filter` which expects all filters to match (`filter a && filter b && ...`) and handles filters without a selection as matched.

  * Example for `and` WITHOUT empty selection matched:
  `(sum = true, filter = false) => sum && filter`
  * Example for `or` with empty selection matched:
  `(sum = false, filter = true) => sum || filter`
  * Example for `or` WITHOUT empty selection matched:
  `(sum = false, filter = false) => sum || filter`

* **selections:object**

  The initial selections and the value which [resetSelection()](#child-properties) resets to.

  The keys of this object are the selectionKeys specified in the `filters` property.
  The value of each key should be an array of the selected options.

* **component:ReactComponent, render(ownProps):ReactNode, children:ReactNode**

  See [Passing children](#passing-children)

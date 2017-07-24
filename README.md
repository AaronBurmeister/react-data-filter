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
    - `key:string`: the unique key of the filter - this is internally used but can also be used in rendering
    - `options:array`: the possible filter options
    - `selection:array`: the currently selected filter options - this can be used to create controlled components (You can look into this [gist](https://gist.github.com/markerikson/d71cfc81687f11609d2559e8daee10cc) for more information on controlled and uncontrolled components)
    - `setSelection:function`: this function should be used to update the filter. It takes one argument, namely an array of the currently selected options
    - `...filterProps:any`: additional parameters which can be passed in `<DataFilter>`'s `filters` prop.

* **clearSelection:function**

  This function can be used to clear all currently set filters.

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
      key: string,
      resolveValue: (dataEntry) => filterValue,
      ...filterProps,
    },
    ...
  ]}
  allowEmptyFilters={boolean}

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
  Each filter needs to have a unique `key` which is used for assigning internally.
  It also needs a `resolveValue` function which resolves the value from a data entry which should be used for filtering.
  You can also pass your own properties as these will be passed to the underlying children and can be useful for the rendering of the filter controls.
  See [Child properties](#child-properties) for more details.

* **allowEmptyFilters:boolean**

  Specifies whether filters with no options should not be ignored.

* **component:ReactComponent, render(ownProps):ReactNode, children:ReactNode**

  See [Passing children](#passing-children)

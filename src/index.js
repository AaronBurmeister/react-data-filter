import PropTypes from 'prop-types'
import React from 'react'
import resolveElement, { renderProps } from 'react-resolve-element'
import _ from 'lodash'

class DataFilter extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    filters: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      resolveValue: PropTypes.func.isRequired,
    })),
    allowEmptyFilters: PropTypes.bool,
    combineFilters: PropTypes.func,
    selections: PropTypes.object,

    ...renderProps,
  }

  static defaultProps = {
    combineFilters: (sum = true, filter = true) => sum && filter,
    selections: {},
  }

  constructor(props) {
    super(props)
    this.updateSelection = this.updateSelection.bind(this)
    this.clearSelection = this.clearSelection.bind(this)
    this.resetSelection = this.resetSelection.bind(this)
    this.resolveFilters = this.resolveFilters.bind(this)
    this.injectSelections = this.injectSelections.bind(this)
    this.filterData = this.filterData.bind(this)

    this.state = {
      filters: this.resolveFilters(props),
      selections: props.selections,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      filters: this.resolveFilters(nextProps),
      selections: nextProps.selections,
    })
  }

  updateSelection(filterKey, values) {
    this.setState(_.set(this.state, ['selections', filterKey], values))
  }

  clearSelection() {
    this.setState({ selections: {} })
  }

  resetSelection() {
    this.setState({ selections: this.props.selections })
  }

  resolveFilters({ filters, data, allowEmptyFilters }) {
    const result = _
      .chain(filters)
      .map(({ resolveValue, ...filter }) => ({
        ...filter,
        options: _
          .chain(data)
          .map(resolveValue)
          .uniq()
          .value(),
        setSelection: (newSelection) => this.updateSelection(filter.key, newSelection),
      }))
      .value()
    if (allowEmptyFilters) return result
    return _.filter(result, ({ options }) => options.length > 0)
  }

  injectSelections() {
    return _.map(this.state.filters, (filter) => ({
      ...filter,
      selection: this.state.selections[filter.key] || [],
    }))
  }

  filterData() {
    return _.filter(this.props.data, (elem) => _.reduce(
      this.props.filters,
      (prevData, { key, resolveValue }) => {
        const selection = this.state.selections[key]
        const isSelection = selection && selection.length
        const result = isSelection ? _.includes(selection, resolveValue(elem)) : undefined
        const prevValue = prevData.init ? undefined : prevData.value
        return {
          init: false,
          value: this.props.combineFilters(prevValue, result),
        }
      },
      { init: true, value: true }
    ).value)
  }

  render() {
    const none = null

    const filters = this.injectSelections()
    const clearSelection = this.clearSelection
    const resetSelection = this.resetSelection
    const data = this.filterData()

    const { component, render, children, ...props } = this.props
    const childProps = { ...props, filters, clearSelection, resetSelection, data }

    return resolveElement({ component, render, children }, childProps, none)
  }
}

export default DataFilter

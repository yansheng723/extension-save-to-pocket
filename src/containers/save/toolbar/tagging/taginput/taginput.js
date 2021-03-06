import styles from './taginput.scss'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { localize } from '../../../../../common/_locales/locales'

import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

const BACKSPACE = 8
const COMMA = 44
const TAB = 9
const ENTER = 13
const DELETE = 46
const ESCAPE = 27
const LEFT = 37
const UP = 38
const RIGHT = 39
const DOWN = 40

export default class Taginput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false
        }
    }

    setError() {
        clearTimeout(this.errorTimer)
        this.setState({ error: true })

        this.errorTimer = setTimeout(() => {
            this.setState({ error: false })
        }, 3000)
    }

    clearError() {
        if (this.state.error) {
            clearTimeout(this.errorTimer)
            this.setState({ error: false })
        }
    }

    /* Input Events
    –––––––––––––––––––––––––––––––––––––––––––––––––– */
    onChange = event => {
        event.preventDefault()
        this.props.setValue(event.target.value)
    }

    onKeyUp = event => {
        switch (event.keyCode) {
            case BACKSPACE:
            case DELETE:
                this.clearError()
                return this.props.handleRemoveAction()
            case ESCAPE:
                this.clearError()
                return this.props.makeTagsInactive(true)
            case DOWN:
            case UP:
                this.clearError()
                return this.props.handleDirection(event.keyCode)
            default:
                this.props.makeTagsInactive()
        }
    }

    onInput = event => {
        if (event.charCode === COMMA || event.keyCode === TAB) {
            event.preventDefault()
            this.props.addTag(this.props.value)
        }

        if (event.keyCode === ENTER) {
            event.preventDefault()
            if (this.props.value) this.props.addTag(this.props.value)
            else this.props.closePanel()
        }

        if (
            this.props.value.length > 24 &&
            event.keyCode !== BACKSPACE &&
            event.keyCode !== DELETE &&
            event.keyCode !== LEFT &&
            event.keyCode !== UP &&
            event.keyCode !== RIGHT &&
            event.keyCode !== DOWN
        ) {
            this.setError()
            event.preventDefault()
            return
        }
    }

    render() {
        let inputClass = cx({
            tagInput: true,
            active: this.props.hasTags
        })

        return (
            <div>
                <input
                    className={inputClass}
                    type="text"
                    ref={this.props.inputRef}
                    value={this.props.value}
                    onChange={this.onChange}
                    onFocus={this.props.setFocus}
                    onBlur={this.props.setBlur}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onInput}
                    onKeyPress={this.onInput}
                />
                {this.state.error && (
                    <div className={styles.tagError}>
                        {localize('tagging', 'invalid_tags')}
                    </div>
                )}
            </div>
        )
    }
}

Taginput.propTypes = {
    setBlur: PropTypes.func,
    setFocus: PropTypes.func,
    addTag: PropTypes.func,
    handleRemoveAction: PropTypes.func,
    handleDirection: PropTypes.func,
    makeTagsInactive: PropTypes.func,
    setValue: PropTypes.func,
    inputRef: PropTypes.func,
    value: PropTypes.string,
    focused: PropTypes.bool,
    hasTags: PropTypes.bool
}

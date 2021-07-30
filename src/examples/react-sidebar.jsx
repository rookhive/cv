import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'

import './index.sass'
import Icon from '../Icon'

class TinySlider extends Component {
    constructor(props) {
        super(props)
        this.tinySliderNode = React.createRef()
    }

    sliderTransitionEndHandler(event) {
        const sliderClassList = event
            ? event.currentTarget.classList
            : this.tinySliderNode.current.classList
        if (!sliderClassList.contains('visible')) {
            sliderClassList.add('visible')
        }
    }

    componentDidMount() {
        setTimeout(this.sliderTransitionEndHandler.bind(this))
    }

    render() {
        return (
            <div
                ref={this.tinySliderNode}
                className="sidebar__navigation-slider"
                onTransitionEnd={this.sliderTransitionEndHandler}
                style={{ ...this.props.slider.styles }}></div>
        )
    }
}

class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.acceptedRoutes = [
            'articles',
            'library',
            'photos'
        ]
        this.state = {
            slider: {
                isMounted: false,
                current: '',
                styles: {}
            },
            tooltip: {
                isVisible: false,
                title: '',
                styles: {}
            }
        }
    }

    componentDidMount() {
        this.mountSlider()
    }

    get getSidebarButtons() {
        return this.props.routes.map(({ path, exact, icon, title }, i) => {
            return (
                <NavLink
                    key={i}
                    to={path}
                    exact={exact}
                    className="sidebar__navigation-link"
                    isActive={(match, location) => {
                        if (match && this.state.slider.isMounted
                            && this.state.slider.current
                                !== location.pathname) {
                            setTimeout(this.moveSlider(location.pathname))
                        }
                        return match
                    }}
                    onMouseEnter={event => {
                        const top = $(event.currentTarget).position().top + 75
                        this.setState(state => ({
                            tooltip: {
                                ...state.tooltip,
                                title,
                                styles: {
                                    ...state.tooltip.styles,
                                    transform: `translateY(${top}px)`
                                }
                            }
                        }))
                    }}>
                    <button className="sidebar__navigation-button">
                        <Icon
                            id={icon}
                            width={18}
                            height={18}/>
                    </button>
                    <span>{title}</span>
                </NavLink>
            )
        })
    }

    toTheTop() {
        $(document).scrollTop(0)
    }

    mountSlider() {
        this.setState(state => ({
            slider: {
                ...state.slider,
                isMounted: true
            }
        }))
    }

    moveSlider = path => {
        if (typeof path !== 'string') return
        path = '/' + path.split('/')[1]
        const linkNodes = document.querySelectorAll('.sidebar__navigation-link')
        const activeLinkNode = Array.prototype.find.call(linkNodes, link => {
            const href = link.getAttribute('href')
            return href === path
        })
        setTimeout(() => {
            this.setState(state => ({
                slider: {
                    ...state.slider,
                    current: location.pathname,
                    styles: {
                        ...state.slider.styles,
                        transform: `translateY(${activeLinkNode.offsetTop}px)`
                    }
                }
            }))
        }, 400)
    }

    configureTooltip = enter => {
        if (!enter) {
            clearTimeout(this.fuckingTimeout)
        }
        this.setState(state => ({
            tooltip: {
                ...state.tooltip,
                styles: {
                    ...state.tooltip.styles,
                    transition: enter
                        ? 'all .2s ease-out'
                        : 'margin-left .2s ease-out, opacity .2s ease-out, '
                            + 'visibility .2s linear'
                },
                isVisible: !!enter
            }
        }))
    }

    render() {
        const tooltipClassName = `sidebar__tooltip ${
            this.state.tooltip.isVisible
                ? 'visible'
                : ''}`

        return (
            <>
                <div className="sidebar__ghost">
                    <div
                        className={tooltipClassName}
                        style={{ ...this.state.tooltip.styles }}>
                        <span>{this.state.tooltip.title}</span>
                    </div>
                </div>
                <aside className="sidebar">
                    <div className="sidebar__content">
                        <div className="sidebar__navigation-wrapper">
                            <nav
                                className="sidebar__navigation"
                                onMouseEnter={() => {
                                    this.fuckingTimeout = setTimeout(
                                        this.configureTooltip, 50, true)
                                }}
                                onMouseLeave={() => this.configureTooltip()}>
                                <Route path={['/:root', '/']} render={
                                    ({ match }) => {
                                        if (
                                            match.path === '/' && match.isExact
                                            || this.acceptedRoutes.includes(
                                                match.params.root)
                                        ) {
                                            return <TinySlider
                                                slider={this.state.slider} />
                                        }
                                    }} />
                                {this.getSidebarButtons}
                            </nav>
                        </div>
                        <button
                            className="sidebar__to-the-top"
                            onClick={this.toTheTop}>
                            <Icon
                                id="icon-arrow-top"
                                width={20}
                                height={20}/>
                        </button>
                    </div>
                </aside>
            </>
        )
    }
}

export default Sidebar
import * as React from 'react';

export type ExpandibleProps = {
  open: boolean,

  transitionTime?: number,
  easing?: string,
  parentClass?: string,
  triggerWhenOpen?: string | HTMLElement,
  lazyRender?: boolean,
  overflowWhenOpen?: 'hidden' | 'visible' | 'auto' | 'scroll' | 'inherit' | 'initial' | 'unset'
}
/**
 * A container for expandible / collapsible content 
 * Based on https://www.npmjs.com/package/react-collapsible 
 */
export class Expandible extends React.PureComponent<ExpandibleProps, {
  isClosed?: boolean,
  shouldSwitchAutoOnNextCycle?: boolean,
  height?: string | number,
  transition?: string,
  hasBeenOpened?: boolean,
  overflow?: ExpandibleProps['overflowWhenOpen'],
}>{

  /**
   * Default properties
   */
  static defaultProps = {
    transitionTime: 200,
    easing: 'linear',
    open: false,
    classParentString: 'Collapsible',
    lazyRender: false,
    overflowWhenOpen: 'hidden',
    accordionPosition: 0
  };

  constructor(props: ExpandibleProps) {
    super(props);

    this.state =
      this.props.open
        ? {
          isClosed: false,
          shouldSwitchAutoOnNextCycle: false,
          height: 'auto',
          transition: 'none',
          hasBeenOpened: true,
          overflow: this.props.overflowWhenOpen
        }
        : {
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
          height: 0,
          transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
          hasBeenOpened: false,
          overflow: 'hidden'
        };
  }

  // Taken from https://github.com/EvandroLG/transitionEnd/
  // Determines which prefixed event to listen for
  whichTransitionEnd = (element: HTMLElement): string => {
    var transitions = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd otransitionend',
      'transition': 'transitionend'
    };

    for (let t in transitions) {
      if (element.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  refs: {
    outer?: HTMLDivElement
    inner?: HTMLDivElement
  };

  componentDidMount() {
    // Set up event listener to listen to transitionend so we can switch the height from fixed pixel to auto for much responsiveness;
    this.refs.outer.addEventListener(this.whichTransitionEnd(this.refs.outer), (event) => {
      if (this.state.isClosed === false) {
        this.setState({
          shouldSwitchAutoOnNextCycle: true
        });
      }
    });
  }

  componentDidUpdate(prevProps: ExpandibleProps) {

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === false) {
      //Set the height to auto to make compoenent re-render with the height set to auto.
      //This way the dropdown will be responsive and also change height if there is another dropdown within it.
      this.makeResponsive();
    }

    if (this.state.shouldSwitchAutoOnNextCycle === true && this.state.isClosed === true) {
      this.prepareToOpen();
    }

    // If there has been a change in the open prop (controlled by accordion)
    if (prevProps.open != this.props.open) {
      if (this.props.open === true) {
        this.openCollapsible();
      }
      else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible = () => {
    this.setState({
      isClosed: true,
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
      overflow: 'hidden',
    });
  }

  openCollapsible = () => {
    this.setState({
      height: this.refs.inner.offsetHeight,
      transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing,
      isClosed: false,
      hasBeenOpened: true
    });
  }

  makeResponsive = () => {
    this.setState({
      height: 'auto',
      transition: 'none',
      shouldSwitchAutoOnNextCycle: false,
      overflow: this.props.overflowWhenOpen
    });
  }

  prepareToOpen = () => {
    //The height has been changes back to fixed pixel, we set a small timeout to force the CSS transition back to 0 on the next tick.
    window.setTimeout(() => {
      this.setState({
        height: 0,
        shouldSwitchAutoOnNextCycle: false,
        transition: 'height ' + this.props.transitionTime + 'ms ' + this.props.easing
      });
    }, 50);
  }

  render() {

    var dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow
    }

    var openClass = this.state.isClosed ? 'is-closed' : 'is-open';

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    var children = this.props.children;
    if (this.props.lazyRender)
      if (!this.state.hasBeenOpened)
        children = null;

    return (
      <div className={this.props.parentClass}>
        <div className={this.props.parentClass + "__contentOuter"} ref="outer" style={dropdownStyle}>
          <div className={this.props.parentClass + "__contentInner"} ref="inner" children={children} />
        </div>
      </div>
    );
  }
}
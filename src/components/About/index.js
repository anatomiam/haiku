import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

import './style.css';

export default class About extends Component {
  // static propTypes = {}
  // static defaultProps = {}
  // state = {}

  render() {
    const { className, ...props } = this.props;
    return (
      <div className={classnames('About', className)} {...props}>
           <form method="post" action="/">
            <input type="text" name="user" />
            <input type="text" name="usddd" />
            <input type="submit" value="Submit" />
          </form>
      </div>
    );
  }
}

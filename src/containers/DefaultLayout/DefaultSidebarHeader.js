import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultSidebarHeader extends Component {

    constructor(props){
        super(props);

        let userDetails = JSON.parse(sessionStorage.getItem("user_details"))

        this.state = {
            name: userDetails.name,
            surname : userDetails.surname,
            type : userDetails.type,
            avatar : userDetails.avatar,
        }
    }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <img src={'assets/img/avatars/'+this.state.avatar} className="img-avatar" alt="Avatar"/>
        <div><strong>{this.state.name} {this.state.surname}</strong></div>
        <div className="text-muted"><small>{this.state.type}</small></div>
        {/*<div className="btn-group" role="group" aria-label="Button group with nested dropdown">*/}
          {/*<button type="button" className="btn btn-link">*/}
            {/*<i className="icon-settings"></i>*/}
          {/*</button>*/}
          {/*<button type="button" className="btn btn-link">*/}
            {/*<i className="icon-speech"></i>*/}
          {/*</button>*/}
          {/*<button type="button" className="btn btn-link">*/}
            {/*<i className="icon-user"></i>*/}
          {/*</button>*/}
        {/*</div>*/}
      </React.Fragment>
    );
  }
}

DefaultSidebarHeader.propTypes = propTypes;
DefaultSidebarHeader.defaultProps = defaultProps;

export default DefaultSidebarHeader;

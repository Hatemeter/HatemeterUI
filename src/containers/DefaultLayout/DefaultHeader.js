import React, { Component } from 'react';
import {  Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import DefaultHeaderDropdown  from './DefaultHeaderDropdown'
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/logo.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'HateMeter Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'HateMeter Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none h-100 b-r-1" display="lg" />
          {/*<Form className="form-inline px-4 d-md-down-none">*/}
              {/*<i className="fa fa-search"></i>*/}
              {/*<Input placeholder="Are you looking for something?"/>*/}
          {/*</Form>*/}
        <Nav className="ml-auto" navbar>
          {/*<DefaultHeaderDropdown notif/>*/}
          {/*<DefaultHeaderDropdown tasks/>*/}
          {/*<DefaultHeaderDropdown mssgs/>*/}
          <NavItem className="d-md-down-none">
            {/*<NavLink href="#"><i className="icon-location-pin"></i></NavLink>*/}
          </NavItem>
          <DefaultHeaderDropdown accnt/>
        </Nav>
        {/*<AppAsideToggler className="d-md-down-none" />*/}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;

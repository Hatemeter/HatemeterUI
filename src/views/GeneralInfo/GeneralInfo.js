import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';

class GeneralInfo extends Component {
  constructor(props) {
    super(props);

  }
 componentDidMount(){
     document.body.classList.remove("aside-menu-lg-show")
 }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card>
              <CardHeader>
                WP3
              </CardHeader>
              <CardBody>
                Project Hatemeter aims at systematising, augmenting and sharing knowledge on Anti-Muslim hatred online, and at increasing the efficiency and effectiveness of NGO/CSOs in preventing and tackling Islamophobia at EU level, by developing and testing an ICT tool (i.e., HATEMETER platform) that automatically monitors and analyses Internet and social media data on the phenomenon, and produces computer-assisted responses and hints to support counter-narratives and awareness raising campaigns.
                <br/>
                <p>
                [ ... ]
                </p>
              </CardBody>
              <CardFooter><i className="icons cui-globe"><a href="http://hatemeter.eu" target="_blank">hatemeter.eu</a></i></CardFooter>
            </Card>
          </Col>

        </Row>
      </div>
    );
  }
}

export default GeneralInfo;

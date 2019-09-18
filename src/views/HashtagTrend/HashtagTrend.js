import React, {Component, lazy, Suspense} from 'react';
import {Bar, Line} from 'react-chartjs-2';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
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
    DropdownToggle, FormGroup, Input, Label,
    Progress,
    Row,
    Table,
} from 'reactstrap';
import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import $ from "jquery";
import "./HashtgTrend.css"
import * as _ from "underscore";

window.sigma = require('sigma');

require('sigma/build/plugins/sigma.parsers.json.min')
require('sigma/src/renderers/canvas/sigma.canvas.edges.curve')
require('sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve')
const moment = require('moment')
const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    scales: {
        xAxes: [{
            ticks: {
                maxRotation: 90 // angle in degrees
            }
        }]
    },
    maintainAspectRatio: false
}

class HashtagTrend extends Component {

    grafo = undefined


    constructor(props) {
        super(props);
        this.state = {
            hashtag_selected: "",
            snaphot_selected: "",
            snapshotList: [],
            snapshotmap: {},
            chart: {},
            tweets: 0,
            retweets: 0,
            reply: 0,
            topRetweet: []
        }


        let widget = this

        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getHashtagList",
            data: JSON.stringify(""),
            dataType: "json",
            async: false,
            success: function (response) {
                console.log(response)
                let opts = []
                Object.keys(response).forEach(h => {
                    opts.push({value: h, label: h})
                })
                opts = opts.sort();
                widget.state = {snapshotmap: response, hashtag_list: opts}
            },
            error: function (xhr, status) {
                alert("error");
            }
        });


    }


    loadHashTagNetwork = (data) => {

        this.grafo.graph.clear();
        this.grafo.refresh()
        this.grafo.cameras[0].goTo({x: 0, y: 0, angle: 0, ratio: 1.1});

        try {

            data.edges.forEach(function (e) {
                e.type = 'curve'
                //e.color = 'rgba(151, 187, 205, 1)'
            })

            if (data.nodes.length > 50) {
                this.grafo.settings('maxNodeSize', 4);
            } else {
                this.grafo.settings('maxNodeSize', 7);
            }
            this.grafo.graph.read(data);
            this.grafo.refresh()
        } catch (e) {

        }
    }


    handleHashtagChange = (selectedOption) => {
        let widget = this
        console.log(widget.state.snapshotmap)
        this.setState({hashtag_selected: selectedOption}, () => {
            let optionsArray = widget.state.snapshotmap[selectedOption.label]

            let options = []
            optionsArray.forEach(o => {
                let lab = o.replace("_1_","_01_").replace("_2_","_02_").replace("_3_","_03_").replace("_4_","_04_").replace("_5_","_05_").replace("_6_","_06_").replace("_7_","_07_").replace("_8_","_08_").replace("_9_","_09_")
                lab = lab.replace("_1-","_01-").replace("_2-","_02-").replace("_3-","_03-").replace("_4-","_04-").replace("_5-","_05-").replace("_6-","_06-").replace("_7-","_07-").replace("_8-","_08-").replace("_9-","_09-");
                options.push({label: lab, value: o})
            })

            options = _.sortBy(options, 'label');

            widget.setState({
                snapshotList: options,
                snaphot_selected: ""
            })
        });

    }
    handleSnapshotChange = (selectedOption) => {
        let widget = this;
        this.setState({snaphot_selected: selectedOption});
        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getSnapshotData",
            data: {'snapshot': selectedOption.value},
            dataType: "json",
            async: false,
            success: function (response) {


                widget.setState({
                    tweets: response.overall[0],
                    retweets: response.overall[1],
                    reply: response.overall[2],
                    chart: response.chart,
                    topRetweet: response.topretweet
                })

                widget.loadHashTagNetwork(response.net)
            },
            error: function (xhr, status) {
                console.log(status)
                //alert("error");
            }
        });
    }


    componentWillMount() {
        this.state.topRetweet = []
    }

    componentDidMount() {
        document.body.classList.remove("aside-menu-lg-show")
        this.grafo = new window.sigma({
            graph: {
                nodes: [],
                edges: []
            },
            renderer: {
                container: 'graph_container',
                type: 'canvas'
            },
            settings: {
                defaultLabelColor: '#000',
                minEdgeSize: 0.2,
                maxEdgeSize: 3,
                // maxNodeSize:5,
                labelThreshold: 6,
                zoomingRatio: 1.5,

                doubleClickZoomingRatio: 2.8,
                zoomMin: 0
            }
        });
        this.grafo.graph.read({nodes: [], edges: []});
        this.grafo.refresh()
    }


    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" lg="12">
                        <Card>
                            {/*<CardHeader>*/}
                            {/*Hashtag Selection*/}
                            {/*</CardHeader>*/}
                            <CardBody>
                                <Row>
                                    <Col xs="2" sm="2" lg="2">
                                        <Label htmlFor="htselect">Select a Hashtag:</Label>
                                    </Col>
                                    <Col xs="3" sm="3" lg="3">
                                        <Select
                                            value={this.state.hashtag_selected}
                                            onChange={this.handleHashtagChange}
                                            options={this.state.hashtag_list}
                                        />
                                    </Col>
                                    <Col xs="2" sm="2" lg="2">
                                        <Label htmlFor="snselect">Select a time snapshot:</Label>
                                    </Col>
                                    <Col xs="3" sm="3" lg="3">
                                        <Select
                                            value={this.state.snaphot_selected}
                                            onChange={this.handleSnapshotChange}

                                            options={this.state.snapshotList}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                            {/*<CardFooter><i className="icons cui-globe"><a href="http://hatemeter.eu" target="_blank">hatemeter.eu</a></i></CardFooter>*/}
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" lg="7">
                        {/*network */}
                        <Card>
                            <CardHeader>
                                Hashtag co-occurrence network
                            </CardHeader>
                            <CardBody>
                                <div id="graph_container" className="graphcontainer"/>
                            </CardBody>

                        </Card>


                    </Col>
                    <Col xs="12" sm="12" lg="5">
                        <Card >
                            <CardHeader>
                                Overall Statistics
                            </CardHeader>
                            <CardBody>
                                <div className="brand-card-body">

                                    <div>
                                        <div className="text-value">{this.state.tweets}</div>
                                        <div className="text-uppercase text-muted small">Tweets</div>
                                    </div>
                                    <div>
                                        <div className="text-value">{this.state.retweets}</div>
                                        <div className="text-uppercase text-muted small">Retweets</div>
                                    </div>
                                    <div>
                                        <div className="text-value">{this.state.reply}</div>
                                        <div className="text-uppercase text-muted small">Replies</div>
                                    </div>
                                </div>
                            </CardBody>

                        </Card>
                        <Card>
                            <CardHeader>
                                Day-by-day Statistics

                            </CardHeader>
                            <CardBody>
                                <div className="chart-wrapper" style={{minHeight: "250px"}}>
                                    <Bar data={this.state.chart} options={options} ref="chartDaily"/>
                                </div>
                            </CardBody>

                        </Card>

                    </Col>


                </Row>
                <Row> <Col xs="12" sm="12" lg="12">
                    <Card>
                        <CardHeader>
                            Most retweeted messages

                        </CardHeader>
                        <CardBody>
                            {this.state.topRetweet.map(i =>
                                <div className={"topRetweetBox"}>
                                    <Row>
                                        <Col xs="12" sm="12" lg="12">
                                            <a href={i.link} target={"_blank"}>{i.text}</a>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col xs="6" sm="6" lg="2" className={"tweeterData"}> {moment(i.date, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('LLL')}</Col>
                                        <Col xs="6" sm="6" lg="1" className={"retweetCount"}> {i.retweet}</Col>
                                    </Row>
                                </div>
                            )}
                        </CardBody>

                    </Card>
                </Col>
                </Row>
            </div>
        );
    }
}

export default HashtagTrend;

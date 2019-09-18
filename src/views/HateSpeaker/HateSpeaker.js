import React, {Component, lazy, Suspense} from 'react';
import {HorizontalBar, Line} from 'react-chartjs-2';
import Select from 'react-select';
import '../../index.css'
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
import * as _ from "underscore";

window.sigma = require('sigma');
require('sigma/build/plugins/sigma.parsers.json.min')
require('sigma/src/renderers/canvas/sigma.canvas.edges.curve')
require('sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve')

const echarts = require('echarts');
require('echarts-wordcloud');
const randomColor = require('randomcolor');

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


class HateSpeaker extends Component {

    grafo = undefined
    kaywords = undefined

    constructor(props) {
        super(props);
        this.state = {
            hashtag_selected: "",
            snaphot_selected: "",
            snapshotList: [],
            wordcloud: [],
            snapshotmap: {},
            chart: {
                "labels": [],
                "datasets": [
                    {
                        "label": "Connections",
                        "backgroundColor": "rgba(151, 187, 205, 0.5)",
                        "borderColor": "rgba(151, 187, 205, 0.8)",
                        "borderWidth": 1,
                        "hoverBackgroundColor": "rgba(151, 187, 205, 0.8)",
                        "hoverBorderColor": "rgba(151, 187, 205, 0.8)",
                        "data": []
                    }
                ]
            },
            tweets: 0,
            retweets: 0,
            reply: 0
        }


        let widget = this

        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getMentionsList",
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


            this.grafo.graph.read(data);
            if (data.nodes.length > 50) {
                this.grafo.settings('maxNodeSize', 4);
            } else {
                this.grafo.settings('maxNodeSize', 7);
            }


            this.grafo.refresh()
        } catch (e) {

        }
    }


    loadkeywordsCloud = (data) => {
        let me = this
        me.kaywords = echarts.init(document.getElementById('wordCloud'));

        if (!me.kaywords.isDisposed()) {
            me.kaywords.dispose()
        }

        me.kaywords = echarts.init(document.getElementById('wordCloud'));
        let option = {
            title: {
                textStyle: {
                    color: '#fff',
                    fontFamily: 'gnuolane'
                }

            },
            tooltip: {
                show: false
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                // 'horizontal' ¦ 'vertical'
                x: 'right',
                // 'center' ¦ 'left' ¦ 'right'
                // ¦ {number}（x坐标，单位px）
                y: 'top',
                // 'top' ¦ 'bottom' ¦ 'center'
                // ¦ {number}
                color: ['#1e90ff', '#22bb22', '#4b0082', '#d2691e'],
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: '#ccc',
                borderWidth: 0,
                drawOutOfBound: true,
                padding: 5,
                showTitle: false,
                feature: {
                    mark: {
                        show: false
                    },
                    dataZoom: {
                        show: false
                    },
                    dataView: {
                        show: false,
                    },
                    magicType: {
                        show: false,
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: false,
                        title: 'Reload',
                        color: 'black'
                    },
                    saveAsImage: {
                        show: false,
                        title: 'Save',
                        name: 'KD_tag-cloud',
                        type: 'png',
                        lang: ['click to save']
                    },
                    myTool: {
                        show: false
                    }
                }
            },
            series: [{
                name: 'Cloud of Key-Concepts',
                type: 'wordCloud',
                rotationRange: [0, 0],
                rotationStep: 0,
                autoSize: {
                    enable: true,
                    minSize: 14
                },
                textStyle: {
                    normal: {
                        fontFamily: 'gnuolane'
                    }
                },
                data: data
            }]
        };
        me.kaywords.setOption(option);

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
            url: window.HateMeterApiUrlPrefix + "getSnapshotDataMentions",
            data: {'snapshot': selectedOption.value},
            dataType: "json",
            async: true,
            success: function (response) {
                widget.setState({
                    chart: response.chartData
                })
                widget.loadHashTagNetwork(response.net)
            },
            error: function (xhr, status) {
                console.log(status)
                //alert("error");
            }
        });

        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getKeywordMention",
            data: {'snapshot': selectedOption.label},
            dataType: "json",
            async: true,
            success: function (response) {
                widget.loadkeywordsCloud(response.keywords)
            },
            error: function (xhr, status) {
                console.log(status)
                //alert("error");
            }
        });



    }

    openProfile = (elems) => {

        if (elems.length > 0) {
            window.open('https://twitter.com/' + elems[0]._view.label, '_blank')
        }
    }





    componentDidMount() {


        document.body.classList.remove("aside-menu-lg-show")


        let me = this
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
                // maxNodeSize:3,
                labelThreshold: 6,
                zoomingRatio: 1.5,

                doubleClickZoomingRatio: 2.8,
                zoomMin: 0
            }
        });

        this.grafo.bind('clickNode', function (e) {

            window.open('https://twitter.com/' + e.data.node.label, '_blank')
        })
        this.grafo.graph.read({nodes: [], edges: []});
        this.grafo.refresh()








    }


    render() {
       // console.log(this.state.overallStat)
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
                    <Col xs="7" sm="7" lg="7">
                        {/*network */}
                        <Card>
                            <CardHeader>
                                User co-occurrence network
                            </CardHeader>
                            <CardBody>
                                <div id="graph_container" className="graphcontainer"/>
                            </CardBody>

                        </Card>


                    </Col>
                    <Col xs="5" sm="5" lg="5">
                        {/*<Card>*/}
                        {/*<CardHeader>*/}
                        {/*Overall Statitics*/}
                        {/*</CardHeader>*/}
                        {/*<CardBody>*/}
                        {/**/}
                        {/*<div className="brand-card-body">*/}

                        {/*<div>*/}
                        {/*<div className="text-value">{this.state.tweets}</div>*/}
                        {/*<div className="text-uppercase text-muted small">Tweets</div>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*<div className="text-value">{this.state.retweets}</div>*/}
                        {/*<div className="text-uppercase text-muted small">Retweets</div>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*<div className="text-value">{this.state.reply}</div>*/}
                        {/*<div className="text-uppercase text-muted small">Reply</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</CardBody>*/}

                        {/*</Card>*/}
                        <Card>
                            <CardHeader>
                                Most connected users
                            </CardHeader>
                            <CardBody>
                                <p style={{fontSize: "10px"}}>Click on the bar to view user profile.</p>

                                <div className="chart-wrapper" style={{height:"400px"}}>
                                    <HorizontalBar data={this.state.chart} options={options} ref="chartDaily"
                                                   onElementsClick={elems => {this.openProfile(elems)
                                                   }}/>
                                </div>
                            </CardBody>

                        </Card>
                        <Card>
                            <CardHeader>
                                Keywords
                            </CardHeader>
                            <CardBody>
                                <p style={{fontSize: "10px"}}>Keywords related to user mentions</p>
                                 <div style={{overflow:"hidden"}}>
                                <div id="wordCloud" className="chart-wrapper" style={{height: "400px",width: "100%"}}/>
                                </div>
                            </CardBody>

                        </Card>
                    </Col>


                </Row>
            </div>
        );
    }
}

export default HateSpeaker;

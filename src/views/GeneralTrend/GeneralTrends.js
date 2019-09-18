import React, {Component, lazy, Suspense} from 'react';
import Select from 'react-select';
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
    Form,
    Input,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle, Label,
    Progress,
    Row,
    Table,
} from 'reactstrap';
import MessagesSideBar from './MessagesSide'
import $ from "jquery";
import '../../index.css'
import './GeneralTrends.css'
import ReactDOM from "react-dom";
import ReactResizeDetector from 'react-resize-detector';

window.sigma = require('sigma');
require('sigma/build/plugins/sigma.parsers.json.min')
require('sigma/src/renderers/canvas/sigma.canvas.edges.curve')
require('sigma/src/renderers/canvas/sigma.canvas.edgehovers.curve')

const echarts = require('echarts');
require('echarts-wordcloud');

// import Widget03 from '../../views/Widgets/Widget03'
const Loading = () => <div>Loading...</div>

class GeneralTrends extends Component {

    grafo = undefined
    kaywords = undefined


    constructor(props) {
        super(props);

        this.state = {
            hashtag_selected: "",
            snaphot_selected: "",
            snapshotList: [],
            latestUsed: [],
            snapshotmap: {},
            messages: [],
            chart: {},
            tweets: 0,
            retweets: 0,
            reply: 0,
            searchtext: "",
            keywordOption: {}
        }


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

            if (data.nodes.length > 25) {
                this.grafo.settings('maxNodeSize', 4);
            } else {
                this.grafo.settings('maxNodeSize', 7);
            }
            this.grafo.graph.read(data);
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

        me.setState({
            keywordOption: {
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
            }
        }, () => {
            me.kaywords.setOption(this.state.keywordOption);
        })


    }


    redrawKeywords = () => {

        if (this.kaywords !== undefined) {

            this.kaywords = echarts.init(document.getElementById('wordCloud'));

            if (!this.kaywords.isDisposed()) {
                this.kaywords.dispose()
            }

            this.kaywords = echarts.init(document.getElementById('wordCloud'));


            this.kaywords.setOption(this.state.keywordOption);
        }
        //console.log("res");
    }


    handleHashtagChange = (selectedOption) => {
        $('#wordCloud').html('')
        this.grafo.graph.clear();
        this.grafo.refresh()
        this.grafo.cameras[0].goTo({x: 0, y: 0, angle: 0, ratio: 1.1});

        let widget = this


        this.setState({hashtag_selected: selectedOption}, () => {

            //document.getElementById('graph_container').innerHTML = '<img src="assets/img/loader.gif" /> '
            //     document.getElementById('wordCloud').innerHTML = '<img src="assets/img/loader.gif" /> '


            $(".card-header-actions").html('<img src="assets/img/loader.gif" height="14"/> ')

            $.ajax({
                type: "POST",
                crossDomain: true,
                url: window.HateMeterApiUrlPrefix + "onTheFlySnapshot",
                data: {'snapshot': selectedOption.label},
                dataType: "json",
                async: true,
                success: function (response) {
                    $(".card-header-actions").html('')
                    //  document.getElementById('graph_container').innerHTML = ' '
                    //  document.getElementById('wordCloud').innerHTML = ''
                    if (response.hasOwnProperty("net")) {
                        widget.loadHashTagNetwork(response.net)
                    }
                    if (response.hasOwnProperty("keywords")) {
                        widget.loadkeywordsCloud(response.keywords)
                    }
                    try {
                        ReactDOM.unmountComponentAtNode(document.getElementById('appSideBar'));
                    } catch (e) {
                        console.error(e);
                    }

                    ReactDOM.render(<MessagesSideBar messages={response.messages}/>, document.getElementById('appSideBar'));

                },
                error: function (xhr, status) {
                    console.log("hashtag list error");
                }
            });
        });

    }

    componentDidMount() {
        document.body.classList.add("aside-menu-lg-show")
        let me = this
        let latestUsed = []


        let widget = this

        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getHashtagList",
            data: JSON.stringify(""),
            dataType: "json",
            async: true,
            success: function (response) {
                //   console.log(response)
                let opts = []
                Object.keys(response).forEach(h => {
                    opts.push({value: h, label: h})
                })
                opts = opts.sort();
                widget.setState({snapshotmap: response, hashtag_list: opts})
            },
            error: function (xhr, status) {
                console.log("error in hashtag list");
            }
        });


        this.setState({latestUsed: Loading()}, () => {

                $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: window.HateMeterApiUrlPrefix + "generalTrendLastUsage",
                    data: JSON.stringify(""),
                    dataType: "json",
                    async: true,
                    success: function (response) {
                        for (var property in response) {

                            latestUsed.push(<Row><Col xs="12" sm="12" lg="6"><h6>{property}</h6></Col>
                                <Col xs="12" sm="12" lg="6"><p style={{"fontSize": "11px"}}>{response[property]}</p></Col></Row>)
                        }

                        me.setState({latestUsed: latestUsed})

                    },
                    error: function (xhr, status) {
                        console.log("error in hashtag list");
                    }
                });
            }
        )


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
                labelThreshold: 4,
                zoomingRatio: 1.2,

                doubleClickZoomingRatio: 2.8,
                zoomMin: 0
            }
        });
        this.grafo.graph.read({nodes: [], edges: []});
        this.grafo.refresh()


        /// messages side bar


    }

    onFormSubmit = (evt) => {
        evt.preventDefault();
        this.grafo.graph.clear();
        this.grafo.refresh()
        this.grafo.cameras[0].goTo({x: 0, y: 0, angle: 0, ratio: 1.1});


        $('#wordCloud').html('')

        let widget = this
        if (this.state.searchtext.length > 0) {
            $(".card-header-actions").html('<img src="assets/img/loader.gif" height="14"/> ')
            $.ajax({
                type: "POST",
                crossDomain: true,
                url: window.HateMeterApiUrlPrefix + "onTheFlySnapshot",
                data: {'snapshot': this.state.searchtext},
                dataType: "json",
                async: true,
                success: function (response) {
                    $(".card-header-actions").html('')

                    if (response.hasOwnProperty("net")) {
                        widget.loadHashTagNetwork(response.net)
                    }
                    if (response.hasOwnProperty("keywords")) {
                        widget.loadkeywordsCloud(response.keywords)
                    }

                    try {
                        ReactDOM.unmountComponentAtNode(document.getElementById('appSideBar'));
                    } catch (e) {
                        console.error(e);
                    }

                    ReactDOM.render(<MessagesSideBar messages={response.messages}/>, document.getElementById('appSideBar'));
                },
                error: function (xhr, status) {

                }
            });

        }
    }

    render() {

        return (
            <div className="animated fadeIn">
                <Row>

                    <Col xs="4" sm="4" lg="4">
                        <Card>
                            <CardHeader>
                                Recently used hashtags/keywords (Top 5)
                            </CardHeader>
                            <CardBody>

                                {this.state.latestUsed}
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                Keywords
                                <div className="card-header-actions">

                                </div>
                            </CardHeader>
                            <CardBody>

                                <div id="wordCloud" className="chart-wrapper" style={{height: "300px", width: "100%"}} onResize={() => this.redrawKeywords()}>
                                </div>
                                <ReactResizeDetector handleWidth handleHeight onResize={() => this.redrawKeywords()}/>

                            </CardBody>
                        </Card>

                    </Col>
                    <Col xs="8" sm="8" lg="8">
                        <Card>
                            {/*<CardHeader>*/}
                            {/*Hashtag Selection*/}
                            {/*</CardHeader>*/}
                            <CardBody >
                                <Row>
                                    <Col xs="10" sm="10" lg="6">
                                        <Row>
                                            <Col xs="6" sm="6" lg="6">
                                                <Label htmlFor="htselect">Select a Hashtag:</Label>
                                            </Col>
                                            <Col xs="6" sm="6" lg="6">
                                                <Select
                                                    value={this.state.hashtag_selected}
                                                    onChange={this.handleHashtagChange}
                                                    options={this.state.hashtag_list}
                                                />
                                            </Col>

                                        </Row>
                                    </Col>
                                    <Col xs="10" sm="10" lg="1">
                                        <Label htmlFor="htselect">Or</Label>
                                    </Col>

                                    <Col xs="10" sm="10" lg="5">
                                        <Row>
                                            <Col xs="1" sm="1" lg="1">
                                                <i onClick={this.onFormSubmit} className="fa fa-search" style={{marginRight: "5px"}} style={{cursor: "pointer"}}/>
                                            </Col>
                                            <Col xs="10" sm="10" lg="10">
                                                    <Form className="form-inline px-8 d-md-down-none" onSubmit={this.onFormSubmit}>
                                                        <Input placeholder="Search..." ref={"search"}
                                                               onChange={e => this.setState({searchtext: e.target.value})}
                                                               style={{width:"100%"}}
                                                        />
                                                    </Form>

                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </CardBody>
                            {/*<CardFooter><i className="icons cui-globe"><a href="http://hatemeter.eu" target="_blank">hatemeter.eu</a></i></CardFooter>*/}
                        </Card>
                        <Card>
                            <CardHeader>
                                Hashtag co-occurrence network
                                <div className="card-header-actions">

                                </div>
                            </CardHeader>
                            <CardBody>
                                <div id="graph_container" className="graphcontainer"/>
                            </CardBody>

                        </Card>


                    </Col>

                </Row>
            </div>
        );
    }
}

export default GeneralTrends;

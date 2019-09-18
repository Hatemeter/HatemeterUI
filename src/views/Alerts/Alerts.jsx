import React, {Component} from 'react';
import $ from "jquery";
import Select from 'react-select';
import {HorizontalBar, Line} from 'react-chartjs-2';

import {

    Card,
    CardBody,
    Form,
    Input,
    CardHeader,

    Col, Label,

    Row
} from 'reactstrap';
import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips";


const options = {
    tooltips: {
        enabled: false,
        custom: CustomTooltips
    },
    scales: {
        xAxes: [{
            ticks: {
                display: false // angle in degrees
            }
        }]
    },
    maintainAspectRatio: false

}


class Alerts extends Component {

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


    componentDidMount() {
        document.body.classList.remove("aside-menu-lg-show")

        let widget = this

        $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.HateMeterApiUrlPrefix + "getAlertsHashtagList",
            data: JSON.stringify(""),
            dataType: "json",
            async: true,
            success: function (response) {
                let opts = []
                Object.keys(response).forEach(h => {
                    opts.push({value: response[h], label: response[h]})
                })
                opts = opts.sort();
                widget.setState({hashtag_list: opts})
            },
            error: function (xhr, status) {
                console.log("error in hashtag list");
            }
        });

    }


    handleHashtagChange = (selectedOption) => {

        let widget = this


        this.setState({hashtag_selected: selectedOption}, () => {


            $.ajax({
                type: "POST",
                crossDomain: true,
                url: window.HateMeterApiUrlPrefix + "getAlertsData",
                data: {'hashtag': selectedOption.label},
                dataType: "json",
                async: true,
                success: function (response) {
                    //  console.log(response);

                    let chData = {}
                    let ds = {}
                    let pointBackgroundColors = [];
                    let threshold = response.threshold
                    chData.labels = response.labels
                    ds.data = response.data

                    response.data.forEach(d => {
                        if (d > threshold) {
                            pointBackgroundColors.push("rgba(205,0,18,0.8)")
                        } else {
                            pointBackgroundColors.push("rgba(151, 187, 205, 0.8)")
                        }

                    })

                    ds.label = "Hashtag peak detector"

                    ds.backgroundColor = "rgba(151, 187, 205, 0.5)"
                    ds.borderColor = "rgba(151, 187, 205, 0.8)"
                    ds.borderWidth = 1
                    ds.hoverBackgroundColor = "rgba(151, 187, 205, 0.8)"
                    ds.hoverBorderColor = "rgba(151, 187, 205, 0.8)"
                    ds.pointBackgroundColor = pointBackgroundColors
                    ds.lineTension = 0


                    chData.datasets = []
                    chData.datasets.push(ds)
                    widget.setState({
                        chart: chData
                    })
                    // widget.loadHashTagNetwork(response.net)
                },
                error: function (xhr, status) {
                    console.log(status)
                    //alert("error");
                }
            });


        })
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

                                </Row>
                            </CardBody>
                            {/*<CardFooter><i className="icons cui-globe"><a href="http://hatemeter.eu" target="_blank">hatemeter.eu</a></i></CardFooter>*/}
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" sm="12" lg="12">
                        <Card>
                            {/*<CardHeader>*/}
                            {/*Hashtag Selection*/}
                            {/*</CardHeader>*/}
                            <CardBody>
                                <div className="chart-wrapper" style={{height: "400px"}}>
                                    <Line data={this.state.chart} options={options} ref="chartDaily"/>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Alerts;
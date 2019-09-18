import React, {Component, lazy, Suspense} from 'react';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col, Form, Input,
    Row
} from 'reactstrap';

import "./style.scss"
import "./Bubble"
import $ from "jquery";
import ReactDOM from "react-dom";
import MessagesSideBar from "../GeneralTrend/MessagesSide";
import Bubble from "./Bubble";
import BubbleQueryForm from "./BubbleQueryForm";
import * as moment from 'moment'

const queryString = require('query-string');
const uuidv4 = require('uuid/v4');

class CounterNarratives extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: { },
            hate_message: "",
            queryComponent: undefined,
            replyMessages: [],

        }
        let widget = this
        this.state.hate_message = (queryString.parse(this.props.location.search)).message

        console.log(this.props.location.search)
    }

    performQuery = (search) =>{
        console.log(search)

        let widget = this

        this.setState({hate_message:search,replyMessages: []},()=>{
            if (widget.state.hate_message.length > 0) {
                $.ajax({
                    type: "POST",
                    crossDomain: true,
                    url: window.HateMeterApiUrlPrefix + "counterNarrativeBot",
                    data: {'message': this.state.hate_message},
                    dataType: "json",
                    async: true,
                    success: function (response) {
                        let orginialMessages =[]
                        let repliesComponents = []
                        let index = 0
                        response.forEach(rep => {
                            orginialMessages.push(rep)
                            repliesComponents.push(<Bubble text={rep} index={ index} sender="HateMeter Bot" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)}/>)
                            index++
                        })
                        repliesComponents.push(<Bubble text={""} index={ index}sender="Your own message" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)} />)

                        orginialMessages.push("")
                        let sessione = widget.state.session
                        sessione.id =uuidv4()
                        sessione.message = widget.state.hate_message
                        sessione.originalMessages = orginialMessages
                        sessione.userRepliesMessage = orginialMessages
                        sessione.startedAt =  moment().format('MMMM Do YYYY, h:mm:ss a');

                        widget.setState({replyMessages: repliesComponents, session : sessione},()=>{console.log( widget.state.session)})

                        //console.log(response);
                    },
                    error: function (xhr, status) {

                    }
                });

            }

        })




    }


    handleChooseSave = (index) =>{
        let widget = this
        console.log("saved")
        let bubblesTexts = document.getElementsByClassName("bubbleText");
        let usrReplies = []

        for (let i = 0; i < bubblesTexts.length ; i++) {
            usrReplies.push(bubblesTexts.item(i).textContent)
        }
        let sessione = this.state.session
        sessione.selected = index
        sessione.userRepliesMessage = usrReplies
        sessione.endedAt =  moment().format('MMMM Do YYYY, h:mm:ss a');

        this.setState({session: sessione},() => {


            $.ajax({
                type: "POST",
                crossDomain: true,
                url: window.HateMeterApiUrlPrefix + "saveCounterNarrativeSession",
                data: {'data': JSON.stringify(widget.state.session)},
                dataType: "json",
                async: true,
                success: function (response) {

                    console.log(response);
                },
                error: function (xhr, status) {

                }
            });
        })


    }

    componentDidMount() {
        document.body.classList.remove("aside-menu-lg-show")
        let widget = this

        this.setState({queryComponent: <BubbleQueryForm text={this.state.hate_message} sender="Hate message" callbackParent={(keyword) => this.performQuery(keyword)} />}, () => {
            if (this.state.hate_message) {
                if (this.state.hate_message.length > 0) {
                    $.ajax({
                        type: "POST",
                        crossDomain: true,
                        url: window.HateMeterApiUrlPrefix + "counterNarrativeBot",
                        data: {'message': this.state.hate_message},
                        dataType: "json",
                        async: true,
                        success: function (response) {
                            let orginialMessages =[]
                            let repliesComponents = []
                            let index = 0
                            response.forEach(rep => {
                                orginialMessages.push(rep)
                                repliesComponents.push(<Bubble text={rep} index={ index}  sender="HateMeter Bot" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)} />)
                                index++
                            })
                            repliesComponents.push(<Bubble text={""} index={ index} sender="Your own message" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)}/>)

                            orginialMessages.push("")
                            let sessione = widget.state.session
                            sessione.id =uuidv4()
                            sessione.message = widget.state.hate_message
                            sessione.originalMessages = orginialMessages
                            sessione.userRepliesMessage = orginialMessages
                            sessione.startedAt =  moment().format('MMMM Do YYYY, h:mm:ss a');

                            widget.setState({replyMessages: repliesComponents, session : sessione},()=>{console.log( widget.state.session)})
                            //console.log(response);
                        },
                        error: function (xhr, status) {

                        }
                    });
                }

            }
        })
    }

    onFormSubmit = (evt) => {

        this.setState({queryComponent: undefined, replyMessages: []}, () => {

            evt.preventDefault();

            let widget = this

            this.setState({queryComponent: <Bubble text={this.state.hate_message} sender="Hate message"/>}, () => {


                if (this.state.hate_message.length > 0) {
                    $.ajax({
                        type: "POST",
                        crossDomain: true,
                        url: window.HateMeterApiUrlPrefix + "counterNarrativeBot",
                        data: {'message': this.state.hate_message},
                        dataType: "json",
                        async: true,
                        success: function (response) {

                            let orginialMessages =[]
                            let repliesComponents = []
                            let index = 0
                            response.forEach(rep => {
                                orginialMessages.push(rep)
                                repliesComponents.push(<Bubble text={rep} index={ index}sender="HateMeter Bot" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)} />)
                                index++
                            })
                            repliesComponents.push(<Bubble text={""} index={ index} sender="Your own message" reply="true" callbackChooseSave={(index) => widget.handleChooseSave(index)} />)

                            orginialMessages.push("")
                            let sessione = widget.state.session
                            sessione.id =uuidv4()
                            sessione.message = widget.state.hate_message
                            sessione.originalMessages = orginialMessages
                            sessione.userRepliesMessage = orginialMessages
                            sessione.startedAt =  moment().format('MMMM Do YYYY, h:mm:ss a');

                            widget.setState({replyMessages: repliesComponents, session : sessione},()=>{console.log( widget.state.session)})

                            //console.log(response);
                        },
                        error: function (xhr, status) {

                        }
                    });

                }
            })
        })
    }

    render() {

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" lg="12">
                        {/*<div className="wrapper animated fadeIn">*/}
                        {/*    <BubbleQueryForm text={this.state.hate_message} sender="Hate message"/>*/}
                        {/*</div>*/}
                        {/*<Card style={{maxWidth: "70%", margin: "0 auto", marginBottom: "20px"}}>*/}
                        {/*    <CardBody>*/}
                        {/*        <Row>*/}
                        {/*            <Col xs="10" sm="10" lg="10">*/}
                        {/*                <Form className="form-inline px-8 " onSubmit={this.onFormSubmit}>*/}
                        {/*                    <Input placeholder="Insert hate message here..." ref={"hate_message"}*/}
                        {/*                           onChange={e => this.setState({hate_message: e.target.value})}*/}
                        {/*                           style={{width: "100%", height: "130px"}}*/}
                        {/*                           type="textarea"*/}
                        {/*                           value={this.state.hate_message}*/}
                        {/*                    />*/}
                        {/*                </Form>*/}
                        {/*            </Col>*/}
                        {/*            <Col xs="1" sm="1" lg="1" style={{fontSize: "20px"}}>*/}
                        {/*                <i onClick={this.onFormSubmit} className="fa fa-send" style={{marginRight: "5px"}} style={{cursor: "pointer"}}/>*/}
                        {/*            </Col>*/}
                        {/*        </Row>*/}
                        {/*    </CardBody>*/}
                        {/*</Card>*/}
                        <div className="wrapper animated fadeIn">
                            {this.state.queryComponent}
                            {this.state.replyMessages}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CounterNarratives;
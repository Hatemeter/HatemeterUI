import React, {Component} from 'react';
import {Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AppSwitch} from '@coreui/react'


class MessagesSideBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }

    }


    render() {
        console.log(this.props.messages);
        // eslint-disable-next-line
        let messagesList;
        if (this.props.messages !== undefined) {
             messagesList = this.props.messages.map(function (m) {
                return <div>
                    <div className="message">
                        <div className=" mr-3 float-left">
                            <div className="avatar">
                                <img src={m.profileImgUrl} className="img-avatar"/>
                                {/*<span className="avatar-status badge-success"></span>*/}
                            </div>

                        </div>
                        <div>
                            <small className="text-muted mt-1">{m.date}</small>
                            <a href={"#/counterNarratives?message="+encodeURI(m.text).replace(/#/g, '%23').replace(/&/g,'%26')}><i className="tweetReplyCN fa fa-comments-o"/></a>
                            <br/>
                            <small className="text-muted"><a href={"https://twitter.com/" + m.by} target="_blank">{m.by}</a></small>
                            {m.type === "rt" ? <small className="text-muted"><i className="fa fa-retweet"/> <a href={"https://twitter.com/" + m.fromUser} target="_blank">{m.fromUser}</a></small> : ""}

                        </div>
                        {/*<div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>*/}
                        <br/>
                        <div className="tweetMsgBox" onClick={() => {
                            window.open("https://twitter.com/" + m.by + "/status/" + m.id, '_blank');
                        }}>
                            <small className="text-muted">{m.text} </small>
                        </div>
                    </div>
                    <hr/>
                </div>;
            })
        }
        return (
            <React.Fragment>

                <TabContent activeTab="1">
                    <TabPane tabId="1" className="p-3">
                        {messagesList}
                    </TabPane>

                </TabContent>
            </React.Fragment>
        );
    }
}


export default MessagesSideBar;

import React, {Component} from 'react';
import "./extraBubbleStyle.css"
import $ from "jquery";
import { NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Bubble extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            sender: ""
        }

        this.state.text = this.props.text
        this.state.sender = this.props.sender

    }

    componentDidMount() {
        $('.bubbleText').bind('copy', function (e) {
            e.preventDefault();
            return false;
        });
    }
    copyStringToClipboard (str) {
        // Create new element
        var el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style = {position: 'absolute', left: '-9999px'};
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
    handleSave = (e) => {
        let txt = e.target.parentElement.parentElement.firstChild.firstChild.textContent
        this.copyStringToClipboard(txt)
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        NotificationManager.success('Copied to clipboard',"",1000);
        this.props.callbackChooseSave(this.props.index);
    }
    handleOnFocus = (e) => {
        this.selectElementContents(e.target.parentElement.parentElement.firstChild.firstChild)
    }

    selectElementContents(el) {
        let range = document.createRange();
        range.selectNodeContents(el);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    render() {
        return (
            <div className={"speechbubble " + (this.props.reply === "true" ? "leftarrow" : "rightarrow") + " animated fadeIn"}>
                    <span className="bubbleContent">
                        <div>
                        <span className="bubbleText" contentEditable="true" style={{cursor: "text"}}>{this.state.text}</span>
                        </div>
                    <span className="bubbleButtons">
                        <i className="fa fa-edit" style={{marginBottom: "8px", cursor: "pointer"}} onClick={(e) => this.handleOnFocus(e)}/>
                        <i className="fa fa-save" style={{marginBottom: "12px", cursor: "pointer"}} onClick={(e) => this.handleSave(e)}/></span>
                    </span>
                <span className="username">{this.state.sender}</span>
            </div>
        );
    }
}

export default Bubble;
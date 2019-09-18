import React, {Component} from 'react';
 import {Form, Input} from 'reactstrap';

class BubbleQueryForm extends Component {

    constructor(props) {
        super(props);
        this.state= {
            text :"",
            sender : ""
        }

        this.state.text = this.props.text
        this.state.sender = this.props.sender

    }
    onFormSubmit = (evt) => {
        this.props.callbackParent(this.state.text); // we notify our parent

    }
    render() {
        return (
            <div className={"speechbubble " + (this.props.reply === "true" ? "leftarrow" :"rightarrow") + " animated fadeIn" }>
                <p>
                    <Form className="form-inline px-8" onSubmit={this.onFormSubmit} style={{flexFlow:'row',alignItems:"start"}}>
                        <Input placeholder="Insert hate message here..." ref={"hate_message"}
                               onChange={e => this.setState({text: e.target.value})}
                               type="textarea"
                               resize="none"
                               value={this.state.text}
                               style = {{resize:"none",width:"100%",height: "130px",backgroundColor:"transparent",borderColor:"transparent",color:"#fff"}}
                        />

                        <i onClick={this.onFormSubmit} className="fa fa-comments-o " style={{fontSize:"30px", marginLeft:"10px",cursor:"pointer"}}/>
                    </Form>
                    {/*<div contentEditable="true" style={{cursor:"text"}}>{this.state.text}</div>*/}
                </p>
                <span className="username">{this.state.sender}</span>
            </div>
        );
    }
}

export default BubbleQueryForm;
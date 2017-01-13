import React, { Component } from 'react';
import axios from 'axios';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            line_1: '5',
            line_2: '7',
            line_3: '5'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // console.log(event);
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        console.log(event);
        axios.post('/', {
            line_1: this.state.line_1,
            line_2: this.state.line_2,
            line_3: this.state.line_3
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
            }

    render() {
        console.log("hello");
        return (
           <div className="input-form">
                <input type="text" className="textbox" name="line_1" value={this.state.line_1} onChange={this.handleChange} autoFocus />
                <input type="text" className="textbox" name="line_2" value={this.state.line_2} onChange={this.handleChange} autoFocus />
                <input type="text" className="textbox" name="line_3" value={this.state.line_3} onChange={this.handleChange} autoFocus />
                <a href="#" onClick={this.handleSubmit}><p className="full-circle"></p></a>
            </div>
       )
    }
}

export default Input;
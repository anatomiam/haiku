import React, { Component } from 'react';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            line_1: '5',
            line_2: '7',
            line_3: '5'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // console.log(event);
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        console.log(this.state);
        return (
            <div className="container">
            <form className="input-form">
                <input type="text" className="textbox" name="line_1" value={this.state.line_1} onChange={this.handleChange} autoFocus />
                <input type="text" className="textbox" name="line_2" value={this.state.line_2} onChange={this.handleChange} autoFocus />
                <input type="text" className="textbox" name="line_3" value={this.state.line_3} onChange={this.handleChange} autoFocus />
            </form>
            </div>
        )
    }
}

export default Input;
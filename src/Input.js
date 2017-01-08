import React, { Component } from 'react';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            value: '5\n7\n5'
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        console.log(this.state);
        return (
            <div className="container">
                <textarea className="textbox" value={this.state.value} onChange={this.handleChange} wrap="hard" autoFocus />
                <h1>{this.state.value}</h1>
            </div>
        )
    }
}

export default Input;
import React, { Component } from 'react';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            value: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <textarea className="textbox" value={this.state.value} onChange={this.handleChange} wrap="soft" autoFocus />
                <h1>{this.state.value}</h1>
            </div>
        )
    }
}

export default Input;
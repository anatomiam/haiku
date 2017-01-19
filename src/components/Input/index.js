import React, {Component} from 'react';
import axios from 'axios';

class Input extends Component {
    constructor() {
        super();
        this.state = {
            line_1: '.',
            line_2: '.',
            line_3: '.',
            new_line_1: '.',
            new_line_2: '.',
            new_line_3: '.',
            syllables: [5, 7, 5]
        };
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    checkSyllables(lines, num) {
        if (lines != num) {
            return false;
        } else {
            return true;
        }
    }

    handleChange(event) {
        // console.log(event);
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        // console.log(event);
        var self = this;
        axios
            .post('/', {
                line_1: this.state.line_1,
                line_2: this.state.line_2,
                line_3: this.state.line_3
            })
            .then((response) => {
            // console.log(response.data[1].map((line, i) =>  this.checkSyllables(line, self.state.syllables[i]) ).every(x=>x===true));
                if (response.data[1]
                    .map((line, i) => 
                        this.checkSyllables(line, self.state.syllables[i]))
                    .every(x => x === true)) {
                        self.setState({
                            new_line_1: response.data[0][0].join(' '),
                            new_line_2: response.data[0][1].join(' '),
                            new_line_3: response.data[0][2].join(' ')
                        })}
                else {
                    self.setState({
                        new_line_1: 'Incorrect number of syllables.'
                    })}
                })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="input-form">
                <input
                    type="text"
                    className="textbox"
                    name="line_1"
                    value={this.state.line_1}
                    onChange={this.handleChange}
                    autoFocus/>
                <input
                    type="text"
                    className="textbox"
                    name="line_2"
                    value={this.state.line_2}
                    onChange={this.handleChange}
                    />
                <input
                    type="text"
                    className="textbox"
                    name="line_3"
                    value={this.state.line_3}
                    onChange={this.handleChange}
                    />
                <a href="#" onClick={this.handleSubmit}>
                    <p className="full-circle"></p>
                </a>
                <p>
                    {this.state.new_line_1}<br />
                    {this.state.new_line_2}<br />
                    {this.state.new_line_3}
                </p>
           
            </div>
        )
    }
}

export default Input;
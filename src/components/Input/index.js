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
            new_line_3: '.'
        };
        this.handleChange = this
            .handleChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
    }

    checkSyllables(lines) {
        if (lines.num_syllables_1 != 5) {
            console.log('line 1 is not valid');
        } else {
            console.log('line 1 is valid');
        }
        if (lines.num_syllables_2 != 7) {
            console.log('line 2 is not valid');
        } else {
            console.log('line 2 is valid');
        }
        if (lines.num_syllables_3 != 5) {
            console.log('line 3 is not valid');
        } else {
            console.log('line 3 is valid');
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
            .then(function (response) {
                console.log(response.data.final_1);
                console.log(response.data.final_2);
                console.log(response.data.final_3);

                self.setState({
                    new_line_1: response.data.final_1.join(' '),
                    new_line_2: response.data.final_2.join(' '),
                    new_line_3: response.data.final_3.join(' ')
                })
                //    self.checkSyllables(response.data.final_1);
                // self.checkSyllables(response.data.final_2);
                // self.checkSyllables(response.data.final_3);
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
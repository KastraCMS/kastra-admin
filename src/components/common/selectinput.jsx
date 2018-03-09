import React, {Component} from 'react';

export default class SelectInput extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.props.onChange.bind(this);
        
        this.state = { error: false, errorMessage: '' };
    }

    render() {
        return (
            <div className="form-group row">
                <label htmlFor={this.props.name} className="col-sm-2 col-form-label">{this.props.label}</label>
                <div className="col-sm-10">
                    <select className="form-control" name={this.props.name} onChange={this.handleChange} value={this.props.selectedOption} id={this.props.name}>
                        <option value="">{this.props.placeholder}</option>
                        {this.props.options.map((option, index) => {
                            return (
                                <option key={index} value={option.value}>{option.name}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }
}
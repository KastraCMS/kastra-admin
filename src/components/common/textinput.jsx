import React, {Component} from 'react';

export default class TextInput extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.props.onChange.bind(this);
    }

    render() {
        
        const classInput = this.props.displayError ? 'form-control border-danger' : 'form-control';

        return (
            <div className="form-group row">
                <label htmlFor={this.props.name} className="col-sm-2 col-form-label">{this.props.title}</label>
                <div className="col-sm-10">
                    <textarea id={this.props.name} rows={this.props.rows} className={classInput} name={this.props.name} onChange={this.handleChange} value={this.props.value}></textarea>
                </div>
            </div>
        );
    }
}
import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'

export default class Settings extends Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            description: '', 
            hostUrl: '', 
            cache: true,
            displaySuccess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        //this.fetchSettings();
    }

    fetchSettings() {
        var that = this;
        fetch("").then(function (response) {
            return response.json();
            }).then(function (result) {
                that.setState({
                    title: result.data.title,
                    description: result.data.description, 
                    hostUrl: result.data.hostUrl, 
                    cache: result.data.cache });
        });
    }  

    handleSubmit(event) {
        this.setState({ displaySuccess: true });
        event.preventDefault();
    }

    closeSuccessMessage () {
        this.setState({ display: false });
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">Configure your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">Site settings</h2>                
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="Settings updatet with success" />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" onChange={this.handleChange} title="Site title :" name="title" value={this.state.title} />
                    <SingleInput type="text" onChange={this.handleChange} title="Site description :" name="description" value={this.state.description} />
                    <SingleInput type="text" onChange={this.handleChange} title="Site url :" name="hostUrl" value={this.state.hostUrl} />
                    <div className="form-check row ml-1">
                        <input id="cache" className="form-check-input" name="cache" type="checkbox" checked={this.state.cache} onChange={this.handleChange} /> 
                        <label htmlFor="cache" className="form-check-label">Cache enabled</label> 
                    </div>
                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}
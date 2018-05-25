import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'

export default class Settings extends Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            description: '', 
            hostUrl: '', 
            cacheActivated: false,
            displaySuccess: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);
        this.fetchSiteConfiguration = this.fetchSiteConfiguration.bind(this);
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
        let data = {};
        this.fetchSiteConfiguration(data);
    }

    fetchSiteConfiguration(data) {
        fetch(`${Kastra.API_URL}/api/siteconfiguration/get`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.title = result.title || '';
                    data.description = result.description || '';
                    data.hostUrl = result.hostUrl || ''; 
                    data.cacheActivated = result.cacheActivated || false;

                    this.setState(data);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    handleSubmit(event) {
        
        event.preventDefault();

        let data = {};
        data.title = this.state.title;
        data.description = this.state.description;
        data.hostUrl = this.state.hostUrl; 
        data.cacheActivated = this.state.cacheActivated;

        fetch(`${Kastra.API_URL}/api/siteconfiguration/update`, 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(
                () => {
                    data = {};
                    data.displaySuccess = true;
                    this.fetchSiteConfiguration(data);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    closeSuccessMessage () {
        this.setState({ displaySuccess: false });
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">Configure your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">Site settings</h2>                
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="Settings updated with success" />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" handleChange={this.handleChange} title="Site title :" name="title" value={this.state.title} />
                    <SingleInput type="text" handleChange={this.handleChange} title="Site description :" name="description" value={this.state.description} />
                    <SingleInput type="text" handleChange={this.handleChange} title="Site url :" name="hostUrl" value={this.state.hostUrl} />
                    <CheckboxInput name="cacheActivated" handleChange={this.handleChange} checked={this.state.cacheActivated} title="Cache enabled" />

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}
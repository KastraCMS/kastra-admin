import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import isInteger from 'lodash/isInteger'

export default class Settings extends Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            description: '', 
            hostUrl: '', 
            cacheActivated: false,
            smtpHost: '',
            smtpPort: '',
            smtpPortError: false,
            smtpCredentialsUser: '',
            smtpCredentialsPassword: '',
            smtpEnableSsl: false,
            emailSender: '',
            requireConfirmedEmail: false,
            displaySuccess: false,
            isLoading: false,
            loadingMessage: '',
            errors: []
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
        this.setState({ isLoading: true, loadingMessage: 'Loading settings ...' });
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
                    data.isLoading = false;
                    data.smtpHost = result.smtpHost || '';
                    data.smtpPort = result.smtpPort || '';
                    data.smtpCredentialsUser = result.smtpCredentialsUser || '';
                    data.smtpCredentialsPassword = result.smtpCredentialsPassword || '';
                    data.smtpEnableSsl = result.smtpEnableSsl || false;
                    data.emailSender = result.emailSender || '';
                    data.requireConfirmedEmail = result.requireConfirmedEmail || false;
                    
                    this.setState(data);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchRestartApplication() {
        fetch(`${Kastra.API_URL}/api/siteconfiguration/restart`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
                this.setState({ isLoading: true, message: 'Starting application ...' });
                if(response.ok) {
                    fetch(`${Kastra.API_URL}/api/siteconfiguration/get`, 
                    {
                        method: 'GET',
                        credentials: 'include'
                    })
                    .then((response) => {
                            this.setState({ isLoading: false });
                            if(!response.ok) {
                                alert('Failed to start the application');
                            }
                        }
                    );
                } else {
                    alert('Failed to stop the application');
                }
            }
        )
    }

    handleSubmit(event) {
        
        let errorMessages = [];
        let newState = {};

        event.preventDefault();

        if (isInteger(Number(this.state.smtpPort))) {
            newState.smtpPortError = false;
        } else {
            errorMessages.push("Smtp port must be an integer");
            newState.smtpPortError = true;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;
            this.setState(newState);
        } else {
            let data = {};
            data.title = this.state.title;
            data.description = this.state.description;
            data.hostUrl = this.state.hostUrl; 
            data.cacheActivated = this.state.cacheActivated;
            data.smtpHost = this.state.smtpHost;
            data.smtpPort = this.state.smtpPort;
            data.smtpCredentialsUser = this.state.smtpCredentialsUser;
            data.smtpCredentialsPassword = this.state.smtpCredentialsPassword;
            data.smtpEnableSsl = this.state.smtpEnableSsl;
            data.emailSender = this.state.emailSender;
            data.requireConfirmedEmail = this.state.requireConfirmedEmail;
            
            this.setState({isLoading: true, loadingMessage: 'Save settings ...'});

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
                    this.fetchRestartApplication();
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
        }
    }

    closeSuccessMessage () {
        this.setState({ displaySuccess: false });
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">Configure your website</h4>
                <hr/>
                <h2 className="mb-5 text-center">Site settings</h2>                
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="Settings updated with success" />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" handleChange={this.handleChange} title="Site title :" name="title" value={this.state.title} />
                    <SingleInput type="text" handleChange={this.handleChange} title="Site description :" name="description" value={this.state.description} />
                    <SingleInput type="text" handleChange={this.handleChange} title="Site url :" name="hostUrl" value={this.state.hostUrl} />
                    <CheckboxInput name="cacheActivated" handleChange={this.handleChange} checked={this.state.cacheActivated} title="Cache enabled" />
                    <h3 className="mt-5 mb-4">Email settings</h3>
                    <SingleInput type="text" handleChange={this.handleChange} title="Smtp host :" name="smtpHost" value={this.state.smtpHost} />
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.smtpPortError} title="Smtp port :" name="smtpPort" value={this.state.smtpPort} />
                    <SingleInput type="text" handleChange={this.handleChange} title="Smtp user :" name="smtpCredentialsUser" value={this.state.smtpCredentialsUser} />
                    <SingleInput type="password" handleChange={this.handleChange} title="Smtp password :" name="smtpCredentialsPassword" value={this.state.smtpCredentialsPassword} />
                    <CheckboxInput name="smtpEnableSsl" handleChange={this.handleChange} checked={this.state.smtpEnableSsl} title="Enable Smtp SSL" />
                    <SingleInput type="text" handleChange={this.handleChange} title="Sender email:" name="emailSender" value={this.state.emailSender} />
                    <h3 className="mt-5 mb-4">Sign In</h3>
                    <CheckboxInput className="mt-5 mb-3" name="requireConfirmedEmail" handleChange={this.handleChange} checked={this.state.requireConfirmedEmail} title="Require confirmed email" />
                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}
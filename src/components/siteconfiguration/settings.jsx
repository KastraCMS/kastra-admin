import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import SelectInput from '../common/selectinput'
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import isInteger from 'lodash/isInteger'
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';
import TextInput from '../common/textinput';

class Settings extends Component {

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
            errors: [],
            successMessage: '',
            theme: '',
            themeList: [],
            retry: 0,
            checkConsentNeeded: true,
            consentNotice: '',
            cookieUsePolicyUrl: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onBtnTestClick = this.onBtnTestClick.bind(this);
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
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('settings.loading') });
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
                    data.theme = result.theme || '';
                    data.checkConsentNeeded = result.checkConsentNeeded || true;
                    data.consentNotice = result.consentNotice || '';
                    data.cookieUsePolicyUrl = result.cookieUsePolicyUrl || '';
                    
                    data.themeList = [];
                    if(result.themeList !== undefined && result.themeList !== null) {
                        result.themeList.forEach(function (element) {
                            data.themeList.push({
                                name: element,
                                value: element
                            });
                        });
                    }
                    
                    this.setState(data);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchStartApplication() {
        const { t } = this.props;
        
        fetch(`${Kastra.API_URL}/api/siteconfiguration/get`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
                if(!response.ok) {  
                    if(this.state.retry < 15) {
                        this.setState({ retry: this.state.retry+1 });
                        setTimeout(() => this.fetchStartApplication(), 1000);
                    } else {
                        this.setState({ isLoading: false });
                        alert(t('settings.startFailed'));
                    }
                } else {
                    this.setState({ isLoading: false });
                }
            }
        );
    }

    fetchRestartApplication() {
        const { t } = this.props;
        this.setState({ isLoading: true, message: t('settings.stoppingApplication') });

        fetch(`${Kastra.API_URL}/api/siteconfiguration/restart`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
                this.setState({ isLoading: true, loadingMessage: t('settings.startingApplication') });
                if(response.ok) {
                    this.setState({ retry: 0 }, this.fetchStartApplication());
                } else {
                    alert(t('settings.stopFailed'));
                }
            }
        )
    }

    onBtnTestClick(event) {
        event.preventDefault();

        const { t } = this.props;
        fetch(`${Kastra.API_URL}/api/siteconfiguration/testmailasync`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then((response) => {
                this.setState({ isLoading: true, loadingMessage: t('settings.startingApplication') });
                if(response.ok) {
                    let newState = {};
                    newState.displayErrors = false;
                    newState.displaySuccess = true;
                    newState.isLoading = false;
                    newState.successMessage = t("settings.testSuccess");
                    
                    this.setState(newState);
                } else {
                    const errorMessages = [];
                    errorMessages.push(response.body);

                    let newState = {};
                    newState.errors = errorMessages;
                    newState.displayErrors = true;
                    newState.displaySuccess = false;
                    newState.isLoading = false;
                    
                    this.setState(newState);
                }
            }
        );
    }

    handleSubmit(event) {

        const { t } = this.props;
        let errorMessages = [];
        let newState = {};

        event.preventDefault();

        if (isInteger(Number(this.state.smtpPort))) {
            newState.smtpPortError = false;
        } else {
            errorMessages.push(t('settings.smtpPortMustInteger'));
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
            data.theme = this.state.theme;
            data.checkConsentNeeded = this.state.checkConsentNeeded;
            data.consentNotice = this.state.consentNotice;
            data.cookieUsePolicyUrl = this.state.cookieUsePolicyUrl;
            
            this.setState({isLoading: true, loadingMessage: t('settings.saving')});

            fetch(`${Kastra.API_URL}/api/siteconfiguration/update`, 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken' : getXSRFToken()
                },
                body: JSON.stringify(data)
            })
            .then(
                () => {
                    data = {};
                    data.displaySuccess = true;
                    data.successMessage = t('settings.successMessage');
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
        const { t } = this.props;

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('settings.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('settings.title')}</h2>                
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message={this.state.successMessage} />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.siteTitle')}`} name="title" value={this.state.title} />
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.description')}`} name="description" value={this.state.description} />
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.hostUrl')}`} name="hostUrl" value={this.state.hostUrl} />
                    <SelectInput label={t('settings.theme')} name="theme" onChange={this.handleChange} options={this.state.themeList} selectedOption={this.state.theme} />
                    <CheckboxInput name="cacheActivated" handleChange={this.handleChange} checked={this.state.cacheActivated} title={t('settings.cache')} />
                    <h3 className="mt-5 mb-4">{t('settings.emailSettings')}</h3>
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.smtpHost')}`} name="smtpHost" value={this.state.smtpHost} />
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.smtpPortError} title={`${t('settings.smtpPort')}`} name="smtpPort" value={this.state.smtpPort} />
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.smtpUser')}`} name="smtpCredentialsUser" value={this.state.smtpCredentialsUser} />
                    <SingleInput type="password" handleChange={this.handleChange} title={`${t('settings.smtpPassword')}`} name="smtpCredentialsPassword" value={this.state.smtpCredentialsPassword} />
                    <CheckboxInput name="smtpEnableSsl" handleChange={this.handleChange} checked={this.state.smtpEnableSsl} title={t('settings.smtpSsl')} />
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.emailSender')}`} name="emailSender" value={this.state.emailSender} />
                    <button onClick={this.onBtnTestClick} className="btn btn-outline-info mt-3 mb-3">{t('settings.testmail')}</button>
                    <h3 className="mt-5 mb-4">{t('settings.signIn')}</h3>
                    <CheckboxInput className="mt-5 mb-3" name="requireConfirmedEmail" handleChange={this.handleChange} checked={this.state.requireConfirmedEmail} title={t('settings.confirmedEmail')} />
                    <h3 className="mt-5 mb-4">{t('settings.cookieSettings')}</h3>
                    <CheckboxInput className="mt-5 mb-3" name="checkConsentNeeded" handleChange={this.handleChange} checked={this.state.checkConsentNeeded} title={t('settings.checkConsentNeeded')} />
                    <TextInput type="text" handleChange={this.handleChange} title={`${t('settings.consentNotice')}`} name="consentNotice" value={this.state.consentNotice} />
                    <SingleInput type="text" handleChange={this.handleChange} title={`${t('settings.cookieUsePolicyUrl')}`} name="cookieUsePolicyUrl" value={this.state.cookieUsePolicyUrl} />

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('settings.submit')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(Settings);
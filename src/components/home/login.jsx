import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';

class Login extends Component {

    constructor(props) {
        super(props);
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);

        this.state = {
            email: '',
            password: '',
            rememberMe: false,
            displayErrors: false,
            errors: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value,
            displaySuccess: false
        });
    }

    handleSubmit(event) {
        const { t } = this.props;
        let errorMessages = [];
        let newState = {};
        let data = {};

        event.preventDefault();

        if (this.state.email.length === 0) {
            errorMessages.push(t('login.emptyEmail'));
        }

        if (this.state.password.length === 0) {
            errorMessages.push(t('login.emptyPassword'));
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            this.setState(newState);
        } else {
            this.setState({ isLoading: true, loadingMessage: t('login.loginInProcess') });

            newState.displayErrors = false;
            
            data.email = this.state.email;
            data.password = this.state.password;
            data.rememberMe = false;

            fetch(`${Kastra.API_URL}/api/user/login`, 
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken' : getXSRFToken()
                },
                credentials: 'include',
                body: JSON.stringify(data)
            })
            .then((res) => {
                if(res.ok) {
                    this.props.history.push('/');
                } else {
                    this.setState({ isLoading: false });
                }
            }).catch(function(error) {
                this.setState({ errors: [t('login.login')], displayErrors: true, isLoading: false });
                console.log('Error: \n', error);
            });
        }
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    render() {
        const { t } = this.props;
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('login.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('login.title')}</h2>
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" handleChange={this.handleChange} title={t('login.email')} name="email" value={this.state.email} />
                    <SingleInput type="password" handleChange={this.handleChange} title={t('login.password')} name="password" value={this.state.password} />
                    <CheckboxInput className="mt-5 mb-3" name="rememberMe" handleChange={this.handleChange} checked={this.state.rememberMe} title={t('login.rememberMe')} />

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('login.login')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(Login);
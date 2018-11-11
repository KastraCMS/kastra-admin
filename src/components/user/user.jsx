import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../Utils';

class User extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleRoleChange = this.handleRoleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            userId: props.match.params.userId,
            email: '',
            password: '',
            confirmPassword: '',
            roles: [],
            roleOptions: [],
            emailError: false,
            passwordError: false,
            displaySuccess: false,
            displayErrors: false,
            errors: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        const { t } = this.props;
        let data = {};

        this.setState({ isLoading: true, loadingMessage: t('user.loadingRoles') });

        fetch(`${Kastra.API_URL}/api/role/list`,
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.roleOptions = [];
                    data.isLoading = false;

                    result.forEach(function (element) {
                        data.roleOptions.push({
                            id: element.id,
                            value: element.name,
                            checked: false
                        });
                    });

                    if(this.state.userId !== undefined) {
                        this.fetchUser(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchUser(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('user.loading') });

        if(this.state.userId === undefined) {
            data.isLoading = false;
            this.setState(data);
            return;
        }
        
        fetch(`${Kastra.API_URL}/api/user/get/${this.state.userId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.email = result.email;
                    data.roles = result.roles;
                    data.isLoading = false;

                    if(data.roleOptions.length > 0) {
                        data.roleOptions = this.setCheckBoxValues(data.roleOptions, data.roles);
                    }

                    this.setState(data);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    setCheckBoxValues(options, values) {
        
        for(let i = 0; i < options.length; i++) {
            if(values.includes(options[i].id)) {
                options[i].checked = true;
            } else {
                options[i].checked = false;
            }
        }

        return options;
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

    handleRoleChange(event) {
        let roles = this.state.roles;
        let options = this.state.roleOptions;
        const target = event.target;
        const value = target.value;
        const isChecked = target.checked;
        const index = roles.indexOf(value);

        if(isChecked) {
            roles.splice(index, 0, value);
        } else {
            roles.splice(index, 1);
        }

        this.setState({
            roles: roles,
            rolesOptions: this.setCheckBoxValues(options, roles)
        });
    }

    handleSubmit(event) {

        const { t } = this.props;
        const errorMessages = [];
        let newState = {};

        event.preventDefault();

        if (this.state.email.length === 0) {
            errorMessages.push(t('user.emptyEmail'));
            newState.emailError = true;
        } else {
            newState.emailError = false;
        }

        if(this.state.userId === undefined && this.state.password !== this.state.confirmPassword) {
            errorMessages.push(t('user.samePassword'));
            newState.passwordError = true;
        } else {
            newState.passwordError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;

            this.setState(newState);
            return;
        } else {
            newState.displayErrors = false;
            newState.displaySuccess = true;
        }

        let data = {};
        data.id = this.state.userId;
        data.email = this.state.email;
        data.roles = this.state.roles;
        data.password = this.state.password;

        fetch(`${Kastra.API_URL}/api/user/update`, 
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
        .then(res => res.json())
        .then(
            (result) => {
                if(!result.succeeded) {
                    let errorMessages = [];
                    for(let i = 0; i < result.errors.length; i++) {
                        errorMessages.push(result.errors[i].description);
                    }
                    this.setState({ isLoading: false, displayErrors: true, errors: errorMessages });
                } else {
                    newState.displaySuccess = true;
                    newState.isLoading = false;
                    newState.userId = result;
                    this.setState(newState);
                }
            }
        );
    }

    closeSuccessMessage() {
        this.setState({ displaySuccess: false });
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    renderRoles() {
        return this.state.roleOptions.map((role, index) => {
            return (
                <CheckboxInput key={index} name="roles" value={role.id} handleChange={this.handleRoleChange} checked={role.checked} title={role.value} />
            );
        })
    }

    renderPassword() {
        const { t } = this.props;

        if(this.state.userId !== undefined) {
            return (null);
        }

        return (
            <div>
                <SingleInput type="password" handleChange={this.handleChange} displayError={this.state.passwordError} title={`${t('user.password')} *`} name="password" value={this.state.password} />
                <SingleInput type="password" handleChange={this.handleChange} displayError={this.state.passwordError} title={`${t('user.confirmPassword')} *`} name="confirmPassword" value={this.state.confirmPassword} />          
            </div>
        );
    }

    render() {
        const { t } = this.props;
        let userTitle = (this.state.userId !== undefined) ? t('user.editUser') : t('user.newUser');

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('user.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{userTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message={t('user.updateSuccess')} />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">{t('user.general')}</h3>
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.emailError} title={`${t('user.emailAddress')} *`} name="email" value={this.state.email} />
                    {this.renderPassword()}

                    <h3 className="mt-5 mb-3">{t('user.roles')}</h3>
                    {this.renderRoles()}

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('user.submit')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(User);
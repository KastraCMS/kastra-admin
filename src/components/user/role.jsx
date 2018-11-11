import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../Utils';

class Role extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handlePermissionChange = this.handlePermissionChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            roleId: props.match.params.roleId,
            name: '',
            roles: [],
            permissions: [],
            permissionOptions: [],
            nameError: false,
            displaySuccess: false,
            displayErrors: false,
            errors: [],
            isLoading: true,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        const { t } = this.props;
        let data = {};

        this.setState({ isLoading: true, loadingMessage: t('role.loadingPermissions')});

        fetch(`${Kastra.API_URL}/api/permission/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.permissionOptions = [];
                    data.isLoading = false;
                    
                    result.forEach(function (element) {
                        data.permissionOptions.push({
                            id: element.id,
                            value: element.name,
                            checked: false
                        });
                    });
                    if(this.state.roleId !== undefined) {
                        this.fetchRole(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchRole(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('role.loadingRoles') });

        fetch(`${Kastra.API_URL}/api/role/get/${this.state.roleId}`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then((result) => {
            data.name = result.name;
            data.isLoading = false;

            if(data.permissionOptions.length > 0) {
                data.permissionOptions = this.setCheckBoxValues(data.permissionOptions, data.permissions);
            }

            this.setState(data);
        }
        ).catch(function(error) {
            this.setState({ isLoading: false })
            console.log('Error: \n', error);
        });
    }

    setCheckBoxValues(options, values) {
        
        for(let i = 0; i < options.length; i++) {
            if(values !== undefined && values.includes(options[i].id)) {
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

    handlePermissionChange(event) {
        let permissions = this.state.permissions;
        let options = this.state.permissionOptions;
        const target = event.target;
        const value = parseInt(target.value, 10);
        const isChecked = target.checked;
        const index = permissions.indexOf(value);

        if(isChecked) {
            permissions.splice(index, 0, value);
        } else {
            permissions.splice(index, 1);
        }

        this.setState({
            permissions: permissions,
            permissionOptions: this.setCheckBoxValues(options, permissions)
        });
    }

    handleSubmit(event) {
        
        const { t } = this.props;
        const errorMessages = [];
        let newState = {};

        event.preventDefault();
        
        if (this.state.name.length === 0) {
            errorMessages.push(t('role.emptyName'));
            newState.nameError = true;
        } else {
            newState.nameError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;
        } else {
            newState.displayErrors = false;
            newState.displaySuccess = true;
        }

        let data = {};
        data.id = this.state.roleId;
        data.name = this.state.name;
        data.permissions = this.state.permissions;

        fetch(`${Kastra.API_URL}/api/role/update`, 
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
                newState.displaySuccess = true;
                newState.isLoading = false;
                newState.roleId = result.roleId;
                
                this.setState(newState);
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    closeSuccessMessage() {
        this.setState({ displaySuccess: false });
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    renderPermissions() {
        return this.state.permissionOptions.map((permission, index) => {
            return (
                <CheckboxInput key={index} name="roles" value={permission.id} handleChange={this.handlePermissionChange} checked={permission.checked} title={permission.value} />
            );
        })
    }

    render() {
        const { t } = this.props;
        let roleTitle = (this.state.roleId !== undefined) ? t('role.editRole') : t('role.newRole');

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('role.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{roleTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message={t('role.updateSuccess')}/>
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">{t('role.general')}</h3>
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.nameError} title={`${t('role.name')} *`} name="name" value={this.state.name} />

                    <h3 className="mt-5 mb-3">{t('role.permissions')}</h3>
                    {this.renderPermissions()}

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('role.submit')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(Role);
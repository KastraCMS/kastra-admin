import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import SelectInput from '../common/selectinput'
import CheckboxInput from '../common/checkboxinput';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';

class Module extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            moduleId: props.match.params.moduleId,
            name: '',
            nameError: false,
            definitionId: 0,
            definitionError: false,
            pageId: props.match.params.pageId,
            pageError: false,
            placeId: 0,
            placeError: false,
            definitionOptions: [],
            placeOptions: [],
            errors: [],
            displaySuccess: false,
            displayErrors: false,
            permissionOptions: [],
            permissions: [],
            isLoading: false,
            loadingMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePermissionChange = this.handlePermissionChange.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);
    }

    componentDidMount() {
        let data = {};
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('module.loadingModuleDefinitions') });

        fetch(`${Kastra.API_URL}/api/moduledefinition/list`,
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.isLoading = false;
                    data.definitionOptions = [];
                    
                    result.forEach(function (element) {
                        data.definitionOptions.push({
                            name: element.name,
                            value: element.id
                        });
                    });

                    this.fetchPlaceholders(data);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchModule(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('module.loading')});

        fetch(`${Kastra.API_URL}/api/module/get/${this.state.moduleId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.name = result.name;
                    data.definitionId = result.definitionId;
                    data.pageId = result.pageId;
                    data.placeId = result.placeId;
                    data.permissions = result.permissions;
                    data.isLoading = false;

                    if(data.permissionOptions.length > 0) {
                        data.permissionOptions = this.setCheckBoxValues(data.permissionOptions, data.permissions);
                    }

                    this.setState(data);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchPlaceholders(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('module.loadingPlaces') });

        fetch(`${Kastra.API_URL}/api/place/listbypageid/${this.state.pageId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.isLoading = false;
                    data.placeOptions = [];
                    
                    result.forEach(function (element) {
                        data.placeOptions.push({
                            name: element.keyname,
                            value: element.id
                        });
                    });

                    this.fetchPermissions(data);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchPermissions(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('module.loadingPermissions')});

        fetch(`${Kastra.API_URL}/api/permission/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.isLoading = false;
                    data.permissionOptions = [];
                    
                    result.forEach(function (element) {
                        data.permissionOptions.push({
                            id: element.id,
                            value: element.name,
                            checked: false
                        });
                    });
                    if(this.state.moduleId !== undefined) {
                        this.fetchModule(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
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
            errorMessages.push(t('module.emptyName'));
            newState.nameError = true;
        } else {
            newState.nameError = false;
        }

        if (this.state.definitionId.length === 0) {
            errorMessages.push(t('module.emptyDefinition'));
            newState.definitionError = true;
        } else {
            newState.definitionError = false;
        }

        if (this.state.placeId.length === 0) {
            errorMessages.push(t('module.emptyPlaceholder'));
            newState.placeError = true;
        } else {
            newState.placeError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;

            this.setState(newState);
        } else {
            this.setState({ isLoading: true, loadingMessage: t('module.saving') });

            let data = {};
            data.id = this.state.moduleId;
            data.name = this.state.name;
            data.definitionId = this.state.definitionId;
            data.pageId = this.state.pageId;
            data.placeId = this.state.placeId;
            data.permissions = this.state.permissions;

            fetch(`${Kastra.API_URL}/api/module/update`, 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then((result) => {
                    newState.displayErrors = false;
                    newState.displaySuccess = true;
                    newState.isLoading = false;
                    newState.moduleId = result.moduleId;

                    this.setState(newState);
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
        }
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
                <CheckboxInput key={index} name="permissions" value={permission.id} handleChange={this.handlePermissionChange} checked={permission.checked} title={permission.value} />
            );
        })
    }

    render() {
        const { t } = this.props;
        let moduleTitle = (this.state.moduleId > 0) ? `${t('module.module')} : ${this.state.name}` : t('module.newModule');

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('module.editTitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{moduleTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message={t('module.moduleUpdateSuccess')} />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">{t('module.general')}</h3>
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.nameError} title={`${t('module.name')} *`} name="name" value={this.state.name} />
                    <SelectInput label={`${t('module.moduleDefinition')} *`} placeholder={t('module.selectDefinition')} name="definitionId" displayError={this.state.definitionError} onChange={this.handleChange} options={this.state.definitionOptions} selectedOption={this.state.definitionId} />
                    <SelectInput label={`${t('module.placeholder')} *`} placeholder={t('module.selectPlaceholder')} name="placeId" displayError={this.state.placeError} onChange={this.handleChange} options={this.state.placeOptions} selectedOption={this.state.placeId} />

                    <h3 className="mt-5 mb-3">{t('module.permissions')}</h3>
                    {this.renderPermissions()}

                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('module.submit')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(Module);
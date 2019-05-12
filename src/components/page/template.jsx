import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import SelectInput from '../common/selectinput'
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';

class Template extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            templateId: props.match.params.templateId,
            name: '',
            nameError: false,
            keyname: '',
            keynameOptions: [],
            keynameError: false,
            modelClass: '',
            modelClassError: false,
            viewPath: '',
            viewPathError: false,
            viewPathOptions: [],
            displaySuccess: false,
            displayErrors: false,
            errors: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        let data = {};

        fetch(`${Kastra.API_URL}/api/template/listviewpaths`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.viewPathOptions = [];
                    data.isLoading = false;

                    result.forEach(function (element) {
                        data.viewPathOptions.push({
                            name: element.name,
                            value: element.value
                        });
                    });

                    if(this.state.viewPath !== '') {
                        this.fetchKeynames(data);
                    } else {
                        this.setState(data);
                    }

                    if (this.state.templateId > 0) {
                        data = {};
                        this.fetchTemplate(data);
                    }
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchKeynames(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('page.loading') });

        fetch(`${Kastra.API_URL}/api/template/listkeynames?viewPath=${this.state.viewPath}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                        data.keynameOptions = [];
                        data.isLoading = false;

                        result.forEach(function (element) {
                            data.keynameOptions.push({
                                name: element.name,
                                value: element.value
                            });
                        });

                        this.setState(data);
                    }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    fetchTemplate(data) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('page.loading') });

        fetch(`${Kastra.API_URL}/api/template/get/${this.state.templateId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                        data.name = result.name;
                        data.keyname = result.keyName;
                        data.viewPath = result.viewPath;
                        data.modelClass = result.modelClass;
                        data.isLoading = false;

                        this.setState(data, () => {
                            if (this.state.viewPath.length > 0) {
                                data = {};
                                this.fetchKeynames(data);
                            }
                        });
                    }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            displaySuccess: false
        }, () => {
            if (name === 'viewPath' && value.length > 0) {
                let newData = {};
                this.fetchKeynames(newData);
            }
        });
    }

    handleSubmit(event) {
        const { t } = this.props;
        let errorMessages = [];
        let newState = {};
        let data = {};

        event.preventDefault();

        this.setState({ isLoading: true, loadingMessage: t('page.saving') });

        if (this.state.name.length === 0) {
            errorMessages.push(t('template.emptyName'));
            newState.nameError = true;
        } else {
            newState.nameError = false;
        }

        if (this.state.keyname.length === 0) {
            errorMessages.push(t('template.emptyKeyname'));
            newState.keynameError = true;
        } else {
            newState.keynameError = false;
        }

        if (this.state.modelClass.length === 0) {
            errorMessages.push(t('template.requiredModelClass'));
            newState.modelClassError = true;
        } else {
            newState.modelClassError = false;
        }

        if (this.state.viewPath.length === 0) {
            errorMessages.push(t('template.requiredViewPath'));
            newState.viewPathError = true;
        } else {
            newState.viewPathError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;
            this.setState(newState);
        } else {
            newState.displayErrors = false;
            
            data.id = this.state.templateId;
            data.name = this.state.name;
            data.keyName = this.state.keyname;
            data.modelClass = this.state.modelClass;
            data.viewPath = this.state.viewPath;

            fetch(`${Kastra.API_URL}/api/template/update`, 
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
            .then((result) => {
                    newState.displaySuccess = true;
                    newState.isLoading = false;
                    newState.templateId = result.templateId;

                    this.setState(newState);
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
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

    renderKeyname(t) {
        return (
            <SelectInput label={`${t('template.keyname')} * :`} placeholder={t('template.defaultKeyname')} name="keyname" onChange={this.handleChange} options={this.state.keynameOptions} selectedOption={this.state.keyname} />
        );
    }

    render() {
        const { t } = this.props;
        const keynames = this.state.viewPath.length > 0 ? this.renderKeyname(t) : null;
        const templateTitle = (this.state.pageId > 0) ? `${t('template.template')} : ${this.state.name}` : t('template.newTemplate');

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('template.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{templateTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message={t('template.updateSuccess')} />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.titleError} title={`${t('template.name')} *`} name="name" value={this.state.name} />
                    <SingleInput type="text" handleChange={this.handleChange} displayError={this.state.modelClassError} title={`${t('template.modelClass')} *`} name="modelClass" value={this.state.modelClass} />
                    <SelectInput label={`${t('template.viewPath')} * :`} placeholder={t('template.defaultViewPath')} name="viewPath" onChange={this.handleChange} options={this.state.viewPathOptions} selectedOption={this.state.viewPath} />
                    {keynames}
                    
                    <button type="submit" className="btn btn-outline-info mt-5 float-right">{t('template.submit')}</button>
                </form>
            </div>
        );
    }
}

export default translate()(Template);
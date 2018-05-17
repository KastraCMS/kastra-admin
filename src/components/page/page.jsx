import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import SelectInput from '../common/selectinput'
import TextInput from '../common/textinput'
import * as Kastra from '../../constants'

export default class Page extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
        this.closeSuccessMessage = this.closeSuccessMessage.bind(this);

        this.state = { 
            pageId: props.match.params.pageId,
            title: '',
            titleError: false,
            keyname: '',
            keynameError: false,
            templateId: '',
            templateError: false,
            metaKeywords: '',
            metaDescription: '',
            metaRobot: '',
            displaySuccess: false,
            displayErrors: false,
            templateOptions: [],
            errors: []
        };
    }

    componentDidMount() {
        let data = {};

        fetch(`${Kastra.API_URL}/api/template/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    data.templateOptions = [];
                    
                    result.forEach(function (element) {
                        data.templateOptions.push({
                            name: element.name,
                            value: element.id
                        });
                    });

                    if(this.state.pageId !== undefined) {
                        this.fetchPage(data);
                    } else {
                        this.setState(data);
                    }
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchPage(data) {
        fetch(`${Kastra.API_URL}/api/page/get/${this.state.pageId}`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                        data.title = result.name;
                        data.keyname = result.keyName;
                        data.templateId = result.templateId;
                        data.metaKeywords = result.metaKeywords;
                        data.metaDescription = result.metaDescription;
                        data.metaRobot= result.metaRobot;

                        this.setState(data);
                    }
            ).catch(function(error) {
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
        });
    }

    handleSubmit(event) {

        const errorMessages = [];
        let newState = {};

        event.preventDefault();

        if (this.state.title.length === 0) {
            errorMessages.push("Title can't be empty");
            newState.titleError = true;
        } else {
            newState.titleError = false;
        }

        if (this.state.keyname.length === 0) {
            errorMessages.push("Keyname can't be empty");
            newState.keynameError = true;
        } else {
            newState.keynameError = false;
        }

        if (this.state.templateId.length === 0) {
            errorMessages.push("A template must be selected");
            newState.templateError = true;
        } else {
            newState.templateError = false;
        }

        if(errorMessages.length > 0) {
            newState.errors = errorMessages;
            newState.displayErrors = true;
            newState.displaySuccess = false;
        } else {
            newState.displayErrors = false;
            newState.displaySuccess = true;
        }

        this.setState(newState);
    }

    closeSuccessMessage() {
        this.setState({ displaySuccess: false });
    }

    closeErrorMessage() {
        this.setState({ displayErrors: false });
    }

    render() {
        let pageTitle = (this.state.pageId > 0) ? `Page : ${this.state.title}` : 'New page';

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">Edit the page settings and manage its modules</h4>
                <hr/>
                <h2 className="mb-5 text-center">{pageTitle}</h2>
                <Message display={this.state.displaySuccess} handleClose={this.closeSuccessMessage} type="success" message="Page updated with success" />
                <Message display={this.state.displayErrors} handleClose={this.closeErrorMessage} type="danger" messages={this.state.errors} />
                <form onSubmit={this.handleSubmit}>

                    <h3 className="mt-5 mb-3">General</h3>
                    <SingleInput type="text" onChange={this.handleChange} displayError={this.state.titleError} title="Page title * :" name="title" value={this.state.title} />
                    <SingleInput type="text" onChange={this.handleChange} displayError={this.state.keynameError} title="Page keyname * :" name="keyname" value={this.state.keyname} />
                    <SelectInput label="Template * :" placeholder="Page template" name="templateId" displayError={this.state.templateError} onChange={this.handleChange} options={this.state.templateOptions} selectedOption={this.state.templateId} />
                
                    <h3 className="mt-5 mb-3">SEO</h3>
                    <SingleInput type="text" onChange={this.handleChange} title="Meta keywords :" name="metaKeywords" value={this.state.metaKeywords} />
                    <TextInput onChange={this.handleChange} title="Meta description :" rows="3" name="metaDescription" value={this.state.metaDescription} />
                    <SingleInput type="text" onChange={this.handleChange} title="Meta robot :" name="metaRobot" value={this.state.metaRobot} />
                
                    <button type="submit" className="btn btn-outline-info mt-5 float-right">Submit</button>
                </form>
            </div>
        );
    }
}
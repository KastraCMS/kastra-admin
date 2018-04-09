import React, {Component} from 'react';
import Message from '../common/message'
import SingleInput from '../common/singleinput'
import SelectInput from '../common/selectinput'
import TextInput from '../common/textinput'

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
            templateOptions: [
                {
                    name: 'default template',
                    value: 1
                },
                {
                    name: 'default template 2',
                    value: 2
                },
                {
                    name: 'default template 3',
                    value: 3
                }
            ],
            errors: []
        };
    }

    componentDidMount() {
        
        if(this.state.pageId === undefined) {
            return;
        }

        this.setState({ 
            title: 'Page title test',
            keyname: 'titletest',
            templateId: '2',
            metaKeywords: 'key1, key2, key3',
            metaDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            metaRobot: 'noindex'
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
        let pageTitle = (this.state.pageId > 0) ? `Page : ${this.state.title}` : 'Nouvelle page';

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
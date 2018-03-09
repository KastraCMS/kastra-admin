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
        this.validateForm = this.validateForm.bind(this);

        this.state = { 
            pageId: props.match.params.pageId,
            title: '',
            keyname: '',
            templateId: '',
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
        //this.fetchSettings();
        if(this.state.pageId === undefined) {
            return;
        }

        this.setState({ 
            title: 'title test',
            keyname: 'titletest',
            templateId: '2',
            metaKeywords: 'key1, key 2, key3',
            metaDescription: 'dd  dhbiebhezbhebhe ibdhibeu zaujdd aezua inaihe !éçe',
            metaRobot: 'robot index robot index'
        });
    }

    validateForm() {
        let errors = [];

        if (this.state.title.length === 0) {
            errors.push("Title can't be empty");
        }

        if (this.state.keyname.length === 0) {
            errors.push("Keyname can't be empty");
        }

        if (this.state.templateId.length === 0) {
            errors.push("A template must be selected");
        }

        return errors;
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
        event.preventDefault();

        const errors = this.validateForm();

        if(errors.length > 0) {
            this.setState({ displaySuccess: false, displayErrors: true, errors: errors});
        } else {
            this.setState({ displaySuccess: true, displayErrors: false });
        }
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
                    <SingleInput type="text" onChange={this.handleChange} title="Page title * :" name="title" value={this.state.title} />
                    <SingleInput type="text" onChange={this.handleChange} title="Page keyname * :" name="keyname" value={this.state.keyname} />
                    <SelectInput label="Template * :" placeholder="Page template" name="templateId" onChange={this.handleChange} options={this.state.templateOptions} selectedOption={this.state.templateId} />
                
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
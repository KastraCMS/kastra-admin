import React, {Component} from 'react';
import { isNil } from "lodash";
import Loading from '../common/loading'
import * as Kastra from '../../constants';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';
import SingleInput from '../common/singleinput'
import TextInput from '../common/textinput';

class MailTemplateList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mailTemplates: [],
            isLoading: false,
            loadingMessage: '',
            keyname: '',
            subject: '',
            message: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('mailTemplateList.loading')});

        fetch(`${Kastra.API_URL}/api/siteconfiguration/getmailtemplatelist`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                let mailTemplate = null;
                let mailTemplates = {};
                for (let i = 0; i < result.length; i++) {
                    mailTemplate = {};
                    mailTemplate.id = result[i].id;
                    mailTemplate.keyname = result[i].keyname;
                    mailTemplate.subject = result[i].subject;
                    mailTemplate.message = result[i].message;
                    mailTemplate.editMode = false;

                    mailTemplates[result[i].id] = mailTemplate;
                }

                this.setState({
                    mailTemplates,
                    isLoading: false
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
        const name = `${target.name}`;
        
        this.setState({
            [name]: value
        });
    }

    save(event, id) {
        const { t } = this.props;
        const { keyname, subject, message } = this.state;
        const data = { 
            id,
            keyname,
            subject,
            message 
        };

        event.preventDefault();
       
        this.setState({ isLoading: true, loadingMessage: t('mailTemplateList.saving') });

        fetch(`${Kastra.API_URL}/api/siteconfiguration/savemailtemplate`, 
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
            .then(() => {
                    this.setState({ isLoading: false });
                    this.componentDidMount();
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    setEditMode(event, id, value) {
        event.preventDefault();

        const mailTemplates = this.state.mailTemplates;

        if (isNil(mailTemplates) || mailTemplates.length === 0) {
            return;
        }

        for(let i = 0; i < mailTemplates.length; i++) {
            mailTemplates[mailTemplates[i].id].editMode = false;
        }

        mailTemplates[id].editMode = value;

        this.setState({ 
            mailTemplates, 
            keyname: mailTemplates[id].keyname, 
            subject: mailTemplates[id].subject, 
            message: mailTemplates[id].message 
        });
    }

    renderTemplate(id, mailTemplate) {
        if (mailTemplate.editMode) {
            return (
                <tr key={id}>
                    <td>{this.state.keyname}</td>
                    <td><SingleInput type="text" handleChange={this.handleChange} name="subject" value={this.state.subject} /></td>
                    <td><TextInput type="text" handleChange={this.handleChange} name="message" value={this.state.message} /></td>
                    <td>
                        <a className="action-btn" onClick={(event) => this.save(event, id)}><span className="ion-checkmark"></span></a>
                        <a className="action-btn" onClick={(event) => this.setEditMode(event, id, false)}><span className="ion-close"></span></a>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={id}>
                    <td>{mailTemplate.keyname}</td>
                    <td>{mailTemplate.subject}</td>
                    <td>{mailTemplate.message}</td>
                    <td><a className="action-btn" onClick={(event) => this.setEditMode(event, id, true)}><span className="ion-compose"></span></a></td>
                </tr>
            );
        }
    }

    rendermailTemplates() {
        const { t } = this.props;
        const mailTemplates = this.state.mailTemplates;

        if(this.state.mailTemplates.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('mailTemplateList.nomailTemplateFound')}</td>
                </tr>
            );
        }

        return (
            Object.keys(mailTemplates).map(key => {
                const mailTemplate = mailTemplates[key];
                return this.renderTemplate(key, mailTemplate);
            })
        );
    }

    render() {
        const { t } = this.props;

        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('mailTemplateList.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('mailTemplateList.title')}</h2>

                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">{t('mailTemplateList.keyname')}</th>
                            <th scope="col">{t('mailTemplateList.subject')}</th>
                            <th scope="col">{t('mailTemplateList.message')}</th>
                            <th scope="col">{t('mailTemplateList.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.rendermailTemplates()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(MailTemplateList);
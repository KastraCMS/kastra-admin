import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';

class TemplateList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        const { t } = this.props;
        this.setState({ isLoading: true, loadingMessage: t('templatelist.loadingPages') });

        fetch(`${Kastra.API_URL}/api/template/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                templates: result,
                isLoading: false
            });
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    handleDelete(id) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('templatelist.deleting') });

        fetch(`${Kastra.API_URL}/api/template/delete`, 
        {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken' : getXSRFToken()
            },
            body: JSON.stringify(id)
        })
        .then(
            () => {
                this.componentDidMount();
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    renderTemplates() {
        const { t } = this.props;

        if(this.state.templates.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="6">{t('templatelist.noTemplateFound')}</td>
                </tr>
            );
        }

        return (
            this.state.templates.map((template, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{template.id}</td>
                        <td>{template.name}</td>
                        <td>{template.keyName}</td>
                        <td><Link to={`/admin/pages/template/${template.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" onClick={(e) => e.preventDefault()} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('templatelist.deleteTitle')}
                                message={`${t('templatelist.deleteMessage')} "${template.name}" ?`}
                                onConfirm={() => this.handleDelete(template.id)}
                                confirmLabel={t('templatelist.delete')}
                                cancelLabel={t('templatelist.cancel')} />
                        </td>
                    </tr>
                );
            })
        );
    }

    render() {
        const { t } = this.props;
        
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <Loading isLoading={this.state.isLoading} message={this.state.loadingMessage} />
                <h4 className="text-center">{t('templatelist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('templatelist.title')}</h2>
                <Link to={'/admin/pages/template'} className="btn btn-outline-info mb-4">{t('templatelist.newTemplate')}</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('templatelist.name')}</th>
                            <th scope="col">{t('templatelist.keyname')}</th>
                            <th scope="col">{t('templatelist.edit')}</th>
                            <th scope="col">{t('templatelist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTemplates()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(TemplateList);
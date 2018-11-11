import React, {Component} from 'react';
import { Link } from 'react-router-dom'
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../Utils';

class PageList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            pages: [],
            isLoading: false,
            loadingMessage: ''
        };
    }

    componentDidMount() {
        const { t } = this.props;
        this.setState({ isLoading: true, loadingMessage: t('pagelist.loadingPages') });

        fetch(`${Kastra.API_URL}/api/page/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                pages: result,
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

        this.setState({ isLoading: true, loadingMessage: t('pagelist.deleting') });

        fetch(`${Kastra.API_URL}/api/page/delete`, 
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

    renderPages() {
        const { t } = this.props;

        if(this.state.pages.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="6">{t('pagelist.noPageFound')}</td>
                </tr>
            );
        }

        return (
            this.state.pages.map((page, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{page.id}</td>
                        <td>{page.name}</td>
                        <td>{page.keyName}</td>
                        <td><Link to={`/admin/modules/${page.id}`}><span className="ion-cube"></span></Link></td>
                        <td><Link to={`/admin/pages/edit/${page.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" onClick={(e) => e.preventDefault()} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('pagelist.deleteTitle')}
                                message={`${t('pagelist.deleteMessage')} "${page.name}" ?`}
                                onConfirm={() => this.handleDelete(page.id)}
                                confirmLabel={t('pagelist.delete')}
                                cancelLabel={t('pagelist.cancel')} />
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
                <h4 className="text-center">{t('pagelist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('pagelist.title')}</h2>
                <Link to={'/admin/pages/edit'} className="btn btn-outline-info mb-4">{t('pagelist.newPage')}</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('pagelist.name')}</th>
                            <th scope="col">{t('pagelist.keyname')}</th>
                            <th scope="col">{t('pagelist.modules')}</th>
                            <th scope="col">{t('pagelist.edit')}</th>
                            <th scope="col">{t('pagelist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPages()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(PageList);
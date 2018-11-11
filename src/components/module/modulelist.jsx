import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../Utils';

class ModuleList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            pageId: props.match.params.pageId || 0,
            modules: [],
            isLoading: false,
            loadingMessage: ''
         };

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.setState({ isLoading: true, loadingMessage: 'Loading modules ...' });

        fetch(`${Kastra.API_URL}/api/module/list`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    let modules = result;

                    if(this.state.pageId > 0) {
                        modules = result.filter(module => (module.pageId) === parseInt(this.state.pageId, 10));
                    }
                    
                    this.setState({
                        modules: modules,
                        isLoading: false
                    });
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    handleDelete(id) {
        this.setState({ isLoading: true, loadingMessage: 'Deleting module ...' });

        fetch(`${Kastra.API_URL}/api/module/delete`, 
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

    openPopup(event) {
        event.preventDefault();
        window.open(event.currentTarget.href, 'Module settings', 'width=800,height=600');
    }

    renderModules() {
        const { t } = this.props;

        if(this.state.modules.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('modulelist.noModuleFound')}</td>
                </tr>
            );
        }

        return (
            this.state.modules.map((module, index) => {
                const dialogId = `dialog-${index}`;

                return (
                    <tr key={index}>
                        <td>{module.id}</td>
                        <td>{module.name}</td>
                        <td>
                            <a href={`module/settings/${module.id}/settings`} onClick={(e) => this.openPopup(e)}>
                                <span className="ion-gear-a"></span>
                            </a>
                        </td>
                        <td><Link to={`/admin/modules/edit/${module.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('modulelist.deleteTitle')}
                                message={`${t('modulelist.uninstallAsk')} "${module.name}" ?`}
                                onConfirm={() => this.handleDelete(module.id)}
                                confirmLabel={t('modulelist.deleteConfirm')}
                                cancelLabel={t('modulelist.deleteCancel')} />
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
                <h4 className="text-center">{t('modulelist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('modulelist.title')}</h2>
                {this.state.pageId > 0 && 
                    <Link to={`/admin/modules/new/${this.state.pageId}`} className="btn btn-outline-info mb-5">{t('modulelist.newModule')}</Link>}
                
                <div className="float-right">
                    <Link to={'/admin/modules/install'} className="btn btn-outline-info mb-5">{t('modulelist.manageModuleDefinitions')}</Link>
                </div>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('modulelist.name')}</th>
                            <th scope="col">{t('modulelist.contentSettings')}</th>
                            <th scope="col">{t('modulelist.edit')}</th>
                            <th scope="col">{t('modulelist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderModules()}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default translate()(ModuleList);
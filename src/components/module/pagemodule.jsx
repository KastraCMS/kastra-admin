import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../utils';
import { groupBy } from "lodash";

class PageModule extends Component {

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
                    let modules = groupBy(result, "pageId");

                    this.setState({
                        modules,
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

    renderModules(modules) {
        const { t } = this.props;

        if(modules.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('modulelist.noModuleFound')}</td>
                </tr>
            );
        }

        return (
            modules.map((module, index) => {
                const dialogId = `dialog-${index}`;

                return (
                    <tr key={index}>
                        <td className="font-weight-bold">
                            <a href={`${window.location.origin}/admin/module/settings/${module.id}/settings`}>
                                {module.name}
                            </a>
                            &nbsp;&nbsp;
                            <a href={`${window.location.origin}/admin/module/settings/${module.id}/settings`} onClick={(e) => this.openPopup(e)}>
                                <span className="ion-android-open"></span>
                            </a>
                        </td>
                        <td className="text-center">
                            {module.definitionName}
                        </td>
                        <td className="text-center">
                            {module.placeName}
                        </td>
                        <td className="text-center"><Link to={`/admin/modules/edit/${module.id}`}><span className="ion-compose"></span></Link></td>
                        <td className="text-center">
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

    renderPageModules(key, modules) {
        const { t } = this.props;
        return (
            <div key={key} className="text-white m-sm-5 bg-dark clearfix">
                <h3 className="mb-5">
                    <a data-toggle="collapse" href={`#module-${key}`} aria-expanded="false" aria-controls={`module-${key}`}>
                        <span className="ion-document-text"></span>  {modules[0].pageName}
                    </a>     
                </h3>
                
                <table className="table table-dark bg-dark collapse" id={`module-${key}`}>
                    <thead>
                        <tr>
                            <th scope="col">{t('modulelist.name')}</th>
                            <th className="text-center" scope="col">{t('modulelist.definitionName')}</th>
                            <th className="text-center" scope="col">{t('modulelist.placeName')}</th>
                            <th className="text-center" scope="col">{t('modulelist.edit')}</th>
                            <th className="text-center" scope="col">{t('modulelist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderModules(modules)}
                    </tbody>
                </table>
            </div>
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
                <div className="flex flex-end">
                    <Link to={'/admin/modules/install'} className="btn btn-outline-info">{t('modulelist.manageModuleDefinitions')}</Link>
                </div>
                <div>
                    {Object.keys(this.state.modules).map(key => {
                        return this.renderPageModules(key, this.state.modules[key]);
                    })}
                </div>
            </div>
        );
    }
}
export default translate()(PageModule);
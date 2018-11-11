import React, {Component} from 'react';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'
import Loading from '../common/loading';
import { translate } from 'react-i18next';
import { getXSRFToken } from '../../Utils';

class ModuleInstall extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            modules: [],
            isLoading: false,
            loadingMessage: ''
         };
    }

    componentDidMount() {
        const { t } = this.props;
        this.setState({ isLoading: true, loadingMessage: t('moduleinstall.loadingModules') });

        fetch(`${Kastra.API_URL}/api/moduledefinition/modulefound`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        modules: result,
                        isLoading: false
                    });
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    handleInstall(event, assemblyName) {
        const { t } = this.props;
        event.preventDefault();

        this.setState({ isLoading: true, loadingMessage: t('moduleinstall.installingModule') });

        fetch(`${Kastra.API_URL}/api/moduledefinition/install`, 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken' : getXSRFToken()
            },
            body: JSON.stringify(assemblyName)
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

    handleUninstall(event, assemblyName, moduleDefinitionId) {
        const { t } = this.props;
        event.preventDefault();

        this.setState({ isLoading: true, loadingMessage: t('moduleinstall.uninstallingModule') });

        const data = { name: assemblyName, id: moduleDefinitionId };
        fetch(`${Kastra.API_URL}/api/moduledefinition/uninstall`, 
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
        .then(
            () => {
                this.componentDidMount();
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    renderModules() {
        const { t } = this.props;

        if(this.state.modules.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="4">{t('moduleinstall.noModuleFound')}</td>
                </tr>
            );
        }

        return (
            this.state.modules.map((module, index) => {
                const dialogId = `dialog-${index}`;

                if(module.moduleDefinitionId > 0) {
                    return (
                        <tr key={index}>
                            <td>{module.name}</td>
                            <td><span className='ion-checkmark-round'></span></td>
                            <td>{module.version}</td>
                            <td>
                                <a href="" data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                                <ConfirmDialog id={dialogId} 
                                    title={t('moduleinstall.uninstallModule')}
                                    message={`${t('moduleinstall.uninstallAsk')} "${module.name}" ?`}
                                    onConfirm={(e) => this.handleUninstall(e, module.assemblyName, module.moduleDefinitionId)}
                                    confirmLabel={t('moduleinstall.uninstall')}
                                    cancelLabel={t('moduleinstall.cancel')} />
                            </td>
                        </tr>
                    );
                }

                return (
                    <tr key={index}>
                        <td>{module.assemblyName}</td>
                        <td><span className='ion-close-round'></span></td>
                        <td>{module.version}</td>
                        <td>
                            <a href="" onClick={(e) => this.handleInstall(e, module.assemblyName)}><span className="ion-plus-round"></span></a>
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
                <h4 className="text-center">{t('moduleinstall.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('moduleinstall.title')}</h2>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">{t('moduleinstall.name')}</th>
                            <th scope="col">{t('moduleinstall.status')}</th>
                            <th scope="col">{t('moduleinstall.version')}</th>
                            <th scope="col">{t('moduleinstall.action')}</th>
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

export default translate()(ModuleInstall);
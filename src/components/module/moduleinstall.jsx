import React, {Component} from 'react';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants'

export default class ModuleInstall extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            modules: []
         };
    }

    componentDidMount() {
        fetch(`${Kastra.API_URL}/api/moduledefinition/modulefound`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        modules: result
                    });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    handleInstall(event, assemblyName) {
        event.preventDefault();

        fetch(`${Kastra.API_URL}/api/moduledefinition/install`, 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assemblyName)
        })
        .then(
            () => {
                this.componentDidMount();
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    handleUninstall(event, assemblyName, moduleDefinitionId) {
        event.preventDefault();

        const data = { name: assemblyName, id: moduleDefinitionId };
        fetch(`${Kastra.API_URL}/api/moduledefinition/uninstall`, 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(
            () => {
                this.componentDidMount();
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    renderModules() {

        if(this.state.modules.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="4">No module found</td>
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
                                    title="Uninstall module"
                                    message={`Are you sure you want to uninstall "${module.name}" ?`}
                                    onConfirm={(e) => this.handleUninstall(e, module.assemblyName, module.moduleDefinitionId)}
                                    confirmLabel="Uninstall"
                                    cancelLabel="Cancel" />
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
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h4 className="text-center">All your website module definition</h4>
                <hr/>
                <h2 className="mb-5 text-center">Module definition list</h2>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Version</th>
                            <th scope="col">Action</th>
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
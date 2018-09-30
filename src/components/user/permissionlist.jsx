import React, {Component} from 'react';
import ConfirmDialog from '../common/confirmdialog';
import Loading from '../common/loading'
import * as Kastra from '../../constants';
import { translate } from 'react-i18next';

class PermissionList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            permissions: [],
            isLoading: false,
            loadingMessage: ''
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('permissionlist.loading')});

        fetch(`${Kastra.API_URL}/api/permission/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                permissions: result,
                isLoading: false
            });
            }
        ).catch(function(error) {
            this.setState({ isLoading: false });
            console.log('Error: \n', error);
        });
    }

    handleCreate(event) {
        const { t } = this.props;
        const data = this.state.name;

        event.preventDefault();
       
        this.setState({ isLoading: true, loadingMessage: t('permissionlist.adding') });

        fetch(`${Kastra.API_URL}/api/permission/add`, 
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(
                (result) => {
                    this.componentDidMount();
                }
            ).catch(function(error) {
                this.setState({ isLoading: false });
                console.log('Error: \n', error);
            });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value
        });
    }

    handleDelete(id) {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('permissionlist.deleting') });
        
        fetch(`${Kastra.API_URL}/api/permission/delete`, 
            {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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

    renderPermissions() {
        const { t } = this.props;

        if(this.state.permissions.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('permissionlist.noPermissionFound')}</td>
                </tr>
            );
        }

        return (
            this.state.permissions.map((permission, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{permission.id}</td>
                        <td>{permission.name}</td>
                        <td>
                            <a href="" onClick={(e) => e.preventDefault()} data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('permissionlist.deleteTitle')}
                                message={`${t('permissionlist.deleteMessage')} "${permission.name}" ?`}
                                onConfirm={() => this.handleDelete(permission.id)}
                                confirmLabel={t('permissionlist.delete')}
                                cancelLabel={t('permissionlist.cancel')} />
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
                <h4 className="text-center">{t('permissionlist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('permissionlist.title')}</h2>
                              
                <div className="container mb-4">
                    <div className="row">
                        <input id="name" className="form-control col-sm-3 mr-2" onChange={this.handleChange} name="name" type="text" />
                        <a href="" className="btn btn-outline-info col-sm-1" onClick={this.handleCreate}>{t('permissionlist.add')}</a>
                    </div>
                </div>

                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('permissionlist.name')}</th>
                            <th scope="col">{t('permissionlist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPermissions()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(PermissionList);
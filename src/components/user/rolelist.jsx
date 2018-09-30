import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants';
import Loading from '../common/loading';
import { translate } from 'react-i18next';

class RoleList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            roles: [],
            isLoading: false,
            loadingMessage: ''
        };
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('rolelist.loading')});

        fetch(`${Kastra.API_URL}/api/role/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                roles: result,
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

        this.setState({ isLoading: true, loadingMessage: t('rolelist.deleting') });

        fetch(`${Kastra.API_URL}/api/role/delete`, 
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

    renderRoles() {
        const { t } = this.props;

        if(this.state.roles.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('rolelist.noRoleFound')}</td>
                </tr>
            );
        }

        return (
            this.state.roles.map((role, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                        <td><Link to={`/admin/users/role/${role.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('rolelist.deleteTitle')}
                                message={`${t('rolelist.deleteMessage')} "${role.name}" ?`}
                                onConfirm={() => this.handleDelete(role.id)}
                                confirmLabel={t('rolelist.delete')}
                                cancelLabel={t('rolelist.cancel')} />
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
                <h4 className="text-center">{t('rolelist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('rolelist.title')}</h2>
                <Link to={'/admin/users/role'} className="btn btn-outline-info mb-5">{t('rolelist.newRole')}</Link>
                <table className="table table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('rolelist.name')}</th>
                            <th scope="col">{t('rolelist.edit')}</th>
                            <th scope="col">{t('rolelist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRoles()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(RoleList);
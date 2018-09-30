import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../common/confirmdialog';
import * as Kastra from '../../constants';
import Loading from '../common/loading';
import { translate } from 'react-i18next';

class UserList extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            users: [],
            isLoading: false,
            loadingMessage: ''
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        const { t } = this.props;

        this.setState({ isLoading: true, loadingMessage: t('userlist.loading') });

        fetch(`${Kastra.API_URL}/api/user/list`, 
        {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                users: result,
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

        this.setState({ isLoading: true, loadingMessage: t('userlist.deleting') });

        fetch(`${Kastra.API_URL}/api/user/delete`, 
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

    renderUsers() {
        const { t } = this.props;

        if(this.state.users.length === 0) {
            return (
                <tr>
                    <td align="center" colSpan="5">{t('userlist.noUserFound')}</td>
                </tr>
            );
        }

        return (
            this.state.users.map((user, index) => {
                const dialogId = `dialog-${index}`;
                return (
                    <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td><Link to={`/admin/users/edit/${user.id}`}><span className="ion-compose"></span></Link></td>
                        <td>
                            <a href="" data-toggle="modal" data-target={`#${dialogId}`}><span className="ion-trash-a"></span></a>
                            <ConfirmDialog id={dialogId} 
                                title={t('userlist.deleteTitle')}
                                message={`${t('userlist.deleteMessage')} "${user.userName}" ?`}
                                onConfirm={() => this.handleDelete(user.id)}
                                confirmLabel={t('userlist.delete')}
                                cancelLabel={t('userlist.cancel')} />
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
                <h4 className="text-center">{t('userlist.subtitle')}</h4>
                <hr/>
                <h2 className="mb-5 text-center">{t('userlist.title')}</h2>
                <Link to={'/admin/users/edit'} className="btn btn-outline-info mb-5">{t('userlist.newUser')}</Link>
                <div className="float-right">
                    <Link to={'/admin/users/roles'} className="btn btn-outline-info mb-5">{t('userlist.manageRoles')}</Link>
                    <Link to={'/admin/users/permissions'} className="btn btn-outline-info mb-5 ml-3">{t('userlist.managePermissions')}</Link>
                </div>
                <table className="table table-hover table-dark bg-dark">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">{t('userlist.username')}</th>
                            <th scope="col">{t('userlist.email')}</th>
                            <th scope="col">{t('userlist.edit')}</th>
                            <th scope="col">{t('userlist.delete')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUsers()}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default translate()(UserList);
import React, {Component} from 'react';
import { Line } from 'react-chartjs'
import * as Kastra from '../../constants'

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            data: {}, 
            stats: {}, 
            visits: [], 
            recentUsers: [],
            applicationVersion: '',
            coreVersion: ''
         };
    }

    componentDidMount() {
        this.fetchGraphData();
        this.fetchGlobalStats();
        this.fetchVisits();
        this.fetchRecentUsers();
        this.fetchVersions();
    }

    fetchGraphData() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetVisitorsByDay`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ data: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchGlobalStats() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetGlobalStats`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ stats: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchVisits() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetVisits`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ visits: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchRecentUsers() {
        fetch(`${Kastra.API_URL}/api/Statistics/GetRecentUsers`, 
                {
                    method: 'GET',
                    credentials: 'include'
                })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ recentUsers: result });
                }
            ).catch(function(error) {
                console.log('Error: \n', error);
            });
    }

    fetchVersions() {
        fetch(`${Kastra.API_URL}/api/SiteConfiguration/GetApplicationVersions`, 
            {
                method: 'GET',
                credentials: 'include'
            })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({ 
                    applicationVersion: result.applicationVersion,
                    coreVersion: result.coreVersion
                    });
            }
        ).catch(function(error) {
            console.log('Error: \n', error);
        });
    }

    renderVisitsTable() {
        
            if(this.state.visits.length > 0) {
                return (
                    <table className="table table-hover table-dark bg-dark mt-5 rounded">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>IP address</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.visits.map((visit, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{visit.date}</td>
                                        <td>{visit.username}</td>
                                        <td>{visit.ipAddress}</td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </table>
                );
            } else {
                return (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>User</th>
                                <th>IP address</th>
                                <th>User agent</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>No visit found ...</td></tr>
                        </tbody>
                    </table>
                );
            }
    }

    renderRecentUsers() {
        if(this.state.recentUsers.length > 0) {
            return (
                <table className="table table-hover table-dark bg-dark mt-5 rounded">
                    <tbody>
                    {
                        this.state.recentUsers.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="list-group small">
                                            <div className="w-100">
                                                <h5 className="mb-1">{user.username}</h5>
                                            </div>
                                            <p className="mb-0">{user.email}</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            );
        } else {
            return (
                <p>No user found</p>
            );
        }
    }

    render() {
        if(Object.keys(this.state.data).length === 0) {
            return null;
        }

        return (
            <div className="text-white mt-5 clearfix">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="bg-dark mb-4 p-4">                                  
                                    <blockquote class="blockquote">
                                        <p>Welcome to your web administration !</p>
                                        <footer class="blockquote-footer text-right">
                                            <small>Kastra website (v{this.state.applicationVersion}) based on Kastra Core (v{this.state.coreVersion})</small>
                                        </footer>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3>
                                        <i className={`icon ion-person-stalker`}></i> 
                                        <small> Number of users</small>
                                    </h3>
                                    <h2 className="display-4">{this.state.stats.numberOfUsers}</h2>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3>
                                        <i className={`icon ion-clock`}></i> 
                                        <small> Visits of day</small>
                                    </h3>
                                    <h2 className="display-4">{this.state.stats.visitsPerDay}</h2>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="bg-dark p-4">
                                    <h3><i className="icon ion-clipboard"></i><small> Total visits</small></h3>
                                    <h2 className="display-4">{this.state.stats.totalVisits}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="bg-dark p-4">
                                    <h3>Visits by day</h3>
                                    <Line id="visits-chart" data={this.state.data} options={{ maintainAspectRatio: false, pointDot: false, responsive: true }} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <div className="bg-dark mr-sm-1 p-4">
                                    <h3>Recent users</h3>
                                    {this.renderRecentUsers()}
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-dark p-4">
                                    <h3>Visits</h3>
                                    {this.renderVisitsTable()}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}
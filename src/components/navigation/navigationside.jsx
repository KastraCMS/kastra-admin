import React, {Component} from 'react';
import { NavLink } from 'react-router-dom'

export default class NavigationSide extends Component {
    render() {
        return (
            <ul className="list-unstyled components">
                <ExactNavigationLink url="/admin/" title="Home" className="ion-home" />
                <NavigationLink url="/admin/pages" title="Pages" className="ion-document" />
                <NavigationLink url="/admin/modules" title="Modules" className="ion-cube" />
                <NavigationLink url="/admin/users" title="Users" className="ion-person-stalker" />
                <NavigationLink url="/admin/settings" title="Settings" className="ion-gear-a" />
            </ul>
        );
    }
}

const NavigationLink = (properties) => {
    return (
        <li>
            <NavLink to={properties.url} activeClassName="active">
                <i className={`icon ${properties.className}`}></i>
                {properties.title}
            </NavLink>
        </li>);
};

const ExactNavigationLink = (properties) => {
    return (
        <li>
            <NavLink exact to={properties.url} activeClassName="active">
                <i className={`icon ${properties.className}`}></i>
                {properties.title}
            </NavLink>
        </li>);
};
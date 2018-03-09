import React, {Component} from 'react';

export default class ModuleList extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        //this.fetchSettings();
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h2 className="mb-5 text-center">Module list</h2>
                <h4>All your website module</h4>
                <hr/>
                
            </div>
        );
    }
}
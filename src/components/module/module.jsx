import React, {Component} from 'react';

export default class Module extends React.Component {

    constructor(props) {
        super(props);
        this.state = { moduleId: props.match.params.moduleId };
    }

    componentDidMount() {
        //this.fetchSettings();
    }

    render() {
        return (
            <div className="text-white m-sm-5 p-5 bg-dark clearfix">
                <h2 className="mb-5 text-center">Module {this.state.moduleId}</h2>
                <h4>Edit your module</h4>
                <hr/>
                
            </div>
        );
    }
}
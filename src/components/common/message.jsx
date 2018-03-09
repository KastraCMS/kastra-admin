import React, {Component} from 'react';

export default class Message extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = props.handleClose.bind(this);

        this.state = { display: false, message: '', messages: [] };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ display: nextProps.display, message: nextProps.message, messages: nextProps.messages });  
    }

    handleClick(event) {
        this.setState({ display: false });
        event.preventDefault();
        this.handleClose();
    }

    render() {
        let message;

        if(this.state.messages !== undefined && this.state.messages.length > 0) {
            message = (<ul>
                {this.state.messages.map((message, index) => {
                    return (
                        <li key={index}>{message}</li>
                    );
                })}
            </ul>);
        } else {
            message = this.state.message;
        }

        if(!this.state.display) {
            return (null);
        }

        return (
            <div className={`alert alert-${this.props.type} alert-dismissible fade show`} role="alert">
                {message}
                <button type="button" className="close" onClick={this.handleClick} data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }
}
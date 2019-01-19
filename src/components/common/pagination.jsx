import React, {Component} from 'react';

export default class Pagination extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            index: 0, 
            total: 0, 
            displayNext: this.props.displayNext === undefined ? true : this.props.displayNext, 
            displayPrevious: this.props.displayPrevious === undefined ? true : this.props.displayPrevious,
            infinite: this.props.total === undefined   
        };
    }

    handleClickPrevious(event) {
        const nextIndex = this.state.index-1;
        event.preventDefault();
        this.setState({ index: nextIndex }, 
            this.props.load(nextIndex));
    }

    handleClickNext(event) {
        const nextIndex = this.state.index+1;
        event.preventDefault();
        this.setState({ index: nextIndex }, 
            this.props.load(nextIndex));
    }

    handleClick(event, index) {
        event.preventDefault();
        this.setState({ index }, 
            this.props.load(this.state.index));
    }

    render() {
        const displayPrevious = this.state.displayPrevious || this.state.index !== 0;
        const displayNext = this.state.displayNext || this.state.index !== 0;
        return (
            <div className="mt-2 mb-1">
                <div className="pagination">
                        <a href="" className={displayPrevious ? "" : "hidden"} onClick={(e) => this.handleClickPrevious(e)}><span className="ion-ios-arrow-back"></span></a>
                    {!this.state.infinite &&
                        (<div>
                            {this.state.index > 0 && 
                                (<a href="" onClick={(e) => this.handleClick(e,this.state.index-1)}><span className="ion-ios-arrow-forward"></span></a>)}
                            <spa>{this.state.index}</spa>
                            {this.state.index < this.state.total && 
                                (<a href="" onClick={(e) => this.handleClickNext(e)}><span className="ion-ios-arrow-forward"></span></a>)}
                        </div>)
                    }
                    <a href="" className={displayNext ? "" : "hidden"}  onClick={(e) => this.handleClickNext(e)}><span className="ion-ios-arrow-forward"></span></a>
                </div>
            </div>
        );
    }
}
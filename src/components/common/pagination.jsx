import React, {Component} from 'react';
import {isNil} from "lodash";

export default class Pagination extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            index: 0,
            total: isNil(props.total) ? -1 : props.total,
            infinite: isNil(props.total)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            total: isNil(nextProps.total) ? -1 : nextProps.total,
            infinite: isNil(nextProps.total)
        });
    }

    handleClickPrevious(event) {
        const { enableNegativeIndex, limit } = this.props;
        const { index, infinite, total } = this.state;
        const previousIndex = index-1;
        event.preventDefault();
        if ((enableNegativeIndex && infinite) || (!infinite 
            && ((!enableNegativeIndex && index !== 0) 
            || (enableNegativeIndex && (-previousIndex * limit) < total)))) {
            this.setState({ index: previousIndex }, 
                this.props.load(previousIndex));
        }
    }

    handleClickNext(event) {
        const { enableNegativeIndex, limit } = this.props;
        const { index, infinite, total } = this.state;
        const nextIndex = index+1;

        event.preventDefault();
        if ((infinite && !enableNegativeIndex) || (!enableNegativeIndex && (nextIndex * limit) < total) || (enableNegativeIndex && index < 0)) {
            this.setState({ index: nextIndex }, 
                this.props.load(nextIndex));
        }
    }

    handleClick(event, index) {
        event.preventDefault();
        this.setState({ index }, 
            this.props.load(this.state.index));
    }

    render() {
        const { enableNegativeIndex, limit, loading } = this.props;
        const { index, infinite, total } = this.state;
        const displayPrevious = !loading && (enableNegativeIndex || index !== 0);
        const displayNext = (!enableNegativeIndex && (infinite || (index+1 * limit) < total)) || (enableNegativeIndex && index !== 0);

        return (
            <div className="mt-2 mb-1">
                <div className="pagination">
                        <a href="" className={displayPrevious ? "" : "hidden"} onClick={(e) => this.handleClickPrevious(e)}><span className="ion-ios-arrow-back"></span></a>
                    {!infinite && limit > 0 && total > 0 &&
                        (<div className="numbers">
                            {index > 0 && 
                                (<a href="" onClick={(e) => this.handleClickPrevious(e)}>{index}</a>)}
                            <span>{index+1}</span>
                            {(index+1 * limit) < this.state.total && 
                                (<a href="" onClick={(e) => this.handleClickNext(e)}>{index+2}</a>)}
                            {index === 0 && (index+2 * limit) < this.state.total && 
                                (<a href="" onClick={(e) => this.handleClick(e, index+2)}>{index+3}</a>)}
                        </div>)
                    }
                    <a href="" className={displayNext ? "" : "hidden"}  onClick={(e) => this.handleClickNext(e)}><span className="ion-ios-arrow-forward"></span></a>
                </div>
            </div>
        );
    }
}
import React from 'react';

export class Input extends React.Component {
    render() {
        return (
            <div>
                <input type="text" value={ this.props.location } onChange={ this.props.handlerChange  } placeholder="Enter your location"></input>
            </div>
        )
    }
}
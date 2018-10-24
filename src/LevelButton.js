import React, { Component } from 'react';

export default class LevelButton extends Component {
  render(){
    const changeLevel = this.props.changeLevel;
    const level = this.props.level;
    let name = "btn";
    if (this.props.activeLevel === level) { name = "btn btn-danger" }

    return (
      <button
        className = { name }
        onClick = {() => changeLevel(level)}
      >
        { level }
      </button>
    )
  }
}

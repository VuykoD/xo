import React, { Component } from 'react';

export default class LevelButtons extends Component {
  constructor (props, ctx) {
    super(props, ctx);
    this.state = {
      level: "easy",
    };
    this.changeLevel = this.changeLevel.bind(this);
  }

  changeLevel(level){
    this.setState({
      level
    })
    this.props.click(level);
  }


  render(){
    return (
      <div>
        <span>Level</span>
        <br />
        <LevelButton
          name={this.state.level}
          onClick={this.changeLevel}
          level='easy'
        />
        <LevelButton
          name={this.state.level}
          onClick={this.changeLevel}
          level='middle'
        />
        <LevelButton
          name={this.state.level}
          onClick={this.changeLevel}
          level='hard'
        />
      </div>
    )
  }
}

class LevelButton extends Component {
  render(){
  const level = this.props.level; 
  let name = "btn";
  if (this.props.name===level) { name = "btn btn-danger" }

  return (
    <button
        className = { name }
        onClick = {() => this.props.onClick(level)}
      >
        { level }
      </button>
  )
  }
}
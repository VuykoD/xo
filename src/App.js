import React, { Component } from 'react';
import LevelButtons from './LevelButton'
import './App.css';

export default class App extends Component {
  constructor (props, ctx) {
    super(props, ctx);
    this.gameInit();
    this.level = 'easy';
    this.state = {
      userSign: 'X',
      compSign: 'O',
      firstStep: 'you',
      yourWin: localStorage.getItem('yourWin') || 0,
      compWin: localStorage.getItem('compWin') || 0,
    };
    this.restart = this.restart.bind(this);
    this.changeFirstStep = this.changeFirstStep.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
  }

  changeLevel(level) {
    this.level = level;
    localStorage.setItem('level', level);
    //this.restart();
  }

  gameInit() {
    this.cells = [];
    this.gameContinue = true;
    this.gameStarted = false;
  }

  userMove(x) {
    this.gameStarted = true;
    if (!this.cells[x] && this.gameContinue) {
      this.cells[x] = 'user';
      this.checkWin();

      if (this.gameContinue) {
        this.computerMove();
        this.checkWin();

      }
      for ( let i = 0; i <= 8; i++ ) {
        if ( !this.cells[i] ) break;
        if ( i===8 && this.gameContinue ) setTimeout(()=>alert("It's a draw"),100);
      }
    }
    this.forceUpdate();  
  }

  checkWin() {
    this.checkCoinsedence(0, 1, 2);
    this.checkCoinsedence(0, 4, 8);
    this.checkCoinsedence(0, 3, 6);

    this.checkCoinsedence(1, 4, 7);

    this.checkCoinsedence(2, 4, 6);
    this.checkCoinsedence(2, 5, 8);

    this.checkCoinsedence(3, 4, 5);

    this.checkCoinsedence(6, 7, 8);
  }

  checkCoinsedence(x1, x2, x3) {
    if (this.cells[x1] && this.cells[x1] === this.cells[x2] && this.cells[x1] === this.cells[x3]) {
      this.signal(x1);
    }
  }

  signal(winer) {
    if (this.cells[winer] === 'user') {
      localStorage.setItem('yourWin', +this.state.yourWin + 1);
      this.setState({
        yourWin: +this.state.yourWin + 1,
      }, () => setTimeout(()=>alert("yoy've win"),100));
    } else if (this.cells[winer] === 'comp') {
      localStorage.setItem('compWin', +this.state.compWin + 1);
      this.setState({
        compWin: +this.state.compWin + 1,
      }, () => setTimeout(()=>alert("yoy've lost"),100));
    }
    this.gameContinue = false;
  }

  computerMove() {
    this.gameStarted = true;
    switch (this.level) {
      case 'easy':
        this.randomCell()
        break;
      case 'middle':
        this.twoOfThree = false;
        this.block = false;
        this.analize();
        !this.twoOfThree && this.randomCell();
        break;
      case 'hard':
        this.twoOfThree = false;
        this.block=false;
        this.analize();
        this.compMove = true;
        if (!this.twoOfThree) {
          this.hardCompMove(4);
          this.hardCompMove(0, 8);
          this.hardCompMove(2, 6, 1);
          this.hardCompMove(6, 2, 3);
          this.hardCompMove(3, 5);
          this.hardCompMove(1, 7);
          if (this.compMove)  {this.randomCell()}
        }
        break;
      default:
        break;
    }
  }

  hardCompMove(x1, x2, x3) {
    if (this.compMove && !this.cells[x1] && !this.cells[x2] && !this.cells[x3]) {
      this.compMove = false;
      return this.cells[x1] = 'comp';
    }
  }

  analize() {
    this.findTwoOfThree(0, 1, 2);
    this.findTwoOfThree(0, 2, 1);
    this.findTwoOfThree(0, 3, 6);
    this.findTwoOfThree(0, 6, 3);
    this.findTwoOfThree(0, 4, 8);
    this.findTwoOfThree(0, 8, 4);

    this.findTwoOfThree(1, 2, 0);
    this.findTwoOfThree(1, 4, 7);
    this.findTwoOfThree(1, 7, 4);

    this.findTwoOfThree(2, 4, 6);
    this.findTwoOfThree(2, 6, 4);
    this.findTwoOfThree(2, 5, 8);
    this.findTwoOfThree(2, 8, 5);

    this.findTwoOfThree(3, 4, 5);
    this.findTwoOfThree(3, 5, 4);
    this.findTwoOfThree(3, 6, 0);

    this.findTwoOfThree(4, 5, 3);
    this.findTwoOfThree(4, 6, 2);
    this.findTwoOfThree(4, 7, 1);
    this.findTwoOfThree(4, 8, 0);

    this.findTwoOfThree(5, 8, 2);

    this.findTwoOfThree(6, 7, 8);
    this.findTwoOfThree(6, 8, 7);

    this.findTwoOfThree(7, 8, 6);
  }

  findTwoOfThree(x1, x2, x3) {
    if (this.cells[x1] && !this.cells[x3] && this.cells[x1] === this.cells[x2] && !this.block) {
      this.cells[x3] = 'comp';
      this.block = true;
      this.twoOfThree = true;
    }
  }

  randomCell() {
    let number = null;
    for (let i = 0; i < 1000; i++) {
      number = Math.floor(Math.random() * 9);
      if (this.cells[number] === undefined) return this.cells[number] = 'comp';
    }
  }

  changeUserSing() {
    this.setState({
      userSign: this.state.compSign,
      compSign: this.state.userSign,
    });
  }

  changeFirstStep() {
    if (this.state.firstStep === 'you') {
      this.setState({
        firstStep: 'comp',
      });
      if (!this.gameStarted) {this.computerMove();}
    } else {
      this.setState({
        firstStep: 'you',
      });
    }
  }

    // if (level === this.level) { name = 'btn btn-danger'}

  cell(numberCell) {
    let name = 'borderRight';
    if (numberCell === 2 || numberCell === 5 || numberCell === 8) { name = null }

    return (
      <td
        className={name}
        onClick={() => this.userMove(numberCell)}
      >
        {(this.cells[numberCell] === 'user') && this.state.userSign}
        {(this.cells[numberCell] === 'comp') && this.state.compSign}
      </td>
    );
  }

  restart() {
    this.gameInit();
    this.forceUpdate();
    if (this.state.firstStep === 'comp'){
      this.computerMove();
    }
  }

  render() {
    return (
      <center>
        <div className="container">
          <span>Score</span>
          <br />
          <span>
            You {this.state.yourWin} - {this.state.compWin} comp
          </span>
          <br />
          <button
            onClick={this.restart}
            className="btn btn-info"
            style={{ width: '200px' }}
          >
            Restart
          </button>
          <br />
          <div className="row">
            <div className="col-md-1" />
            <div className="col-md-3">
              <LevelButtons
                click={this.changeLevel}
              />
            </div>
            <div className="col">
              <table>
                <tbody>
                  <tr className="borderBottom">
                    {this.cell(0)}
                    {this.cell(1)}
                    {this.cell(2)}
                  </tr>
                  <tr className="borderBottom">
                    {this.cell(3)}
                    {this.cell(4)}
                    {this.cell(5)}
                  </tr>
                  <tr>
                    {this.cell(6)}
                    {this.cell(7)}
                    {this.cell(8)}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-md-3">
              <span>First step</span>
              <br />
              <button
                className="btn"
                onClick={this.changeFirstStep}
              >
                {this.state.firstStep}
              </button>
              <br />
              <span>Change sign</span>
              <br />
              <button
                className="btn btn45"
                onClick={() => this.changeUserSing()}
              >
                You - {this.state.userSign}
              </button>
              <button
                className="btn btn45"
                onClick={() => this.changeUserSing()}
              >
                Computer - {this.state.compSign}
              </button>
            </div>
            <div className="col-md-1" />
          </div>
        </div>
      </center>
    );
  }
}

import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor (props, ctx) {
    super(props, ctx);
    this.cells = [];
    this.gameContinue = true;
    this.twoOfThree = false;
    this.state = {
      userSign: 'X',
      compSign: 'O',
      firstStep: 'you',
      level:localStorage.getItem('level') || 'easy',
      yourWin:localStorage.getItem('yourWin') || 0,
      compWin:localStorage.getItem('compWin') || 0,
    };
    this.changeFirstStep = this.changeFirstStep.bind(this);
  }

  userMove(x) {
    if (!this.cells[x] && this.gameContinue) {
      this.cells[x] = 'user';
      this.checkWin();

      if (this.gameContinue) {
        this.computerMove();
        this.checkWin();
      }
      this.forceUpdate();
    }
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

  signal(winer){
    if (this.cells[winer] === 'user') {
      localStorage.setItem('yourWin', +this.state.yourWin + 1);
      this.setState({
        yourWin: +this.state.yourWin + 1,
      }, () => alert("yoy've win"));
    } else if (this.cells[winer] === 'comp') {
      localStorage.setItem('compWin', +this.state.compWin + 1);
      this.setState({
        compWin: +this.state.compWin + 1,
      }, () => alert("yoy've lost"));
    }
    this.gameContinue = false;
  }

  computerMove () {
    switch (this.state.level) {
      case 'easy':
        this.randomCell();
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
        }
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

  changeFirstStep () {
    if (this.state.firstStep === 'you') {
      this.setState({
        firstStep: 'comp',
      });
      this.computerMove();
    }
  }

  buttons(level) {
    let name = 'btn';
    if (level === this.state.level) { name = 'btn btn-danger'}
    return (
      <button
        className={name}
        onClick={() => this.changeLevel(level)}
      >
        {level}
      </button>
    );
  }

  changeLevel (level) {
    this.setState({
      level,
    });
    localStorage.setItem('level', level);
  }

  cell (numberCell) {
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

  reload() {
    this.cells = [];
    this.gameContinue = true;
    this.twoOfThree = false;
    this.setState({
      userSign: 'X',
      compSign: 'O',
      firstStep: 'you',
      level:localStorage.getItem('level') || 'easy',
      yourWin:localStorage.getItem('yourWin') || 0,
      compWin:localStorage.getItem('compWin') || 0,
    });
  }

  render() {
    return (
      <center>
        <div className="container">
          <span>Score</span>
          <br />
          <span>
            You {this.state.yourWin}- {this.state.compWin} comp
          </span>
          <br />
          <button
            onClick={this.reload}
            className="btn btn-info"
            style={{ width: '250px' }}
          >
            Restart
          </button>
          <br />
          <div className="row">
            <div className="col-md-1" />
            <div className="col-md-3">
              <span>Level</span>
              <br />
              {this.buttons('easy')}
              <br />
              {this.buttons('middle')}
              <br />
              {this.buttons('hard')}
              <br />
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
                className="btn"
                onClick={() => this.changeUserSing()}
              >
                You - {this.state.userSign}
              </button>
              <br />
              <button
                className="btn"
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

export default App;

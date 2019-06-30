import React, {Component} from 'react'

class Clock extends Component {
  state = {
    h: null,
    m: null,
  }
  timer;
  componentDidMount() {
    const currentTime = new Date(Date.now());
    this.setState({
      h: currentTime.getHours(),
      m: currentTime.getMinutes()<10?`0${currentTime.getMinutes()}`:currentTime.getMinutes()
    })
    this.timer = setInterval(()=>{
      const now = new Date(Date.now());
      this.setState({
        h: now.getHours(),
        m: now.getMinutes()<10?`0${now.getMinutes()}`:now.getMinutes()
      })
    }, 30000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { h, m } = this.state;
    return (
      <div>
        <span className={this.props.classname}>{h>12?h-12:h}:{m} {h>=12?'PM':'AM'}</span>
      </div>
    )
  }
}

export default Clock;
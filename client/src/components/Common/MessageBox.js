import React, { Component } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faBell, faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
library.add(faTimes, faBell, faExclamationCircle);

export default class MessageBox extends Component {
  state={
    hidden: false
  }
  timer = null;
  onHide(e) {
    this.setState({hidden: true});
    this.timer = setInterval(()=>{
      document.getElementById(`msg-box-${this.props.unique}`).style.display = 'none';
      clearInterval(this.timer);
    }, 300);
  }
  iconSwitch(type) {
    switch (type) {
      case 'info':
        return 'info-circle'
      case 'err':
        return 'exclamation-circle';
      case 'noti':
      return 'bell';
      default:
        return 'star'
    }
  }
  render() {
    const { hidden } = this.state;
    const { type, message, unique } = this.props;
    const icon = this.iconSwitch(type);
    return (
      <div className={hidden?`lk-msg ${type} hidden`:`lk-msg ${type}`} id={`msg-box-${unique}`}>
        <div>
          <FontAwesomeIcon icon={icon} className="mr-2"/>
          <span><small>{message}</small></span>
        </div>
        <FontAwesomeIcon icon="times" className="close-icon" onClick={(e)=>this.onHide(e)}/>
      </div>
    )
  }
}

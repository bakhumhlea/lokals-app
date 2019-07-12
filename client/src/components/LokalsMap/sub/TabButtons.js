import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default class TabButtons extends Component {
  render() {
    const { tabs, activeTab, onClickTab } = this.props;
    return (
      <div className="btn-rack flx">
        { tabs.map((tab,i)=>(
          <button
          key={i}
            type="button" 
            className={activeTab===tab.name?"lk-btn active":"lk-btn"} 
            name="exp_tool" 
            onClick={(e)=>onClickTab(tab.name, e)}
          >
            <FontAwesomeIcon icon={tab.icon}/>
          </button>
        ))}
      </div>
    )
  }
}

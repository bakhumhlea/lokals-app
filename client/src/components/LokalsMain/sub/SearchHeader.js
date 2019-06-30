import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchHeader extends Component {
  render() {
    const { prefKw, prefLc, kw, lc, opn, onChange, onSearch, onClearText } = this.props;
    return (
      <div className="lokals-search pd-common on-dk"
        style={{backgroundImage: `url(/images/img-23.jpg)`,backgroundSize: '100%',backgroundPosition: 'center'}}>
        <h2 className="lokals-slogan">Explore and Experience</h2>
        <div className="lk-wrap-inl lk-search-bar">
          <div className="lk-ip-group keyword ">
            <input type="text" className="lk-ip search" placeholder={`Try "Larb", Aunt May Love This!`} name="kw"
            onChange={(e)=>onChange(e)}
            value={kw}/>
            <svg className={kw.length===0?"clear-tx hid":"clear-tx"} width="13" height="13" fill="transparent" onClick={(e)=>onClearText(e,'kw')}>
              <path d="M0 0 L13 13"/>
              <path d="M0 13 L13 0"/>
            </svg>
          </div>
          <div className="lk-ip-group location ">
            <input type="text" className="lk-ip search" placeholder="Try Mission District" name="lc"
            onChange={(e)=>onChange(e)}
            value={lc}/>
            <svg className={lc.length===0?"clear-tx hid":"clear-tx"} width="13" height="13" fill="transparent" onClick={(e)=>onClearText(e,'lc')}>
              <path d="M0 0 L13 13"/>
              <path d="M0 13 L13 0"/>
            </svg>
          </div>
          <div className="lk-ip-group submit">
            <button 
              className="lk-btn btn-suc search"
              onClick={(e)=>onSearch(e)}
            >Go</button>
          </div>
        </div>
        <div className="lokals-qk-search">
          <div className="lk-ip-group opn">
            <button
              className={`lk-tag-btn sm opn-btn ${opn?'selected':''}`}
              name="opn"
              onClick={(e)=>onChange(e,!!!opn)}
            >Open now
              { opn && <FontAwesomeIcon icon="check" className="ic on-r"/>}
            </button>
          </div>
          <div className="kw lk-ip-group">
            {/* <label className="label-1">You are looking for</label> */}
            <div className="flx-contn wrp">
              {prefKw.map((k,i)=>(
                <button key={i} 
                  className={`lk-tag-btn sm ${kw.toLowerCase()===k.toLowerCase()?'selected':''}`}
                  name="kw"
                  onClick={(e)=>onChange(e,k)}
                >{k}</button>
              ))}
            </div>
          </div>
          <div className="lc lk-ip-group">
            {/* <label className="label-1">near</label> */}
            <div className="flx-contn wrp">
              {prefLc.map((l,i)=>(
                <button key={i} 
                  className={`lk-tag-btn sm ${lc.toLowerCase()===l.toLowerCase()?'selected':''}`}
                  name="lc"
                  onClick={(e)=>onChange(e,l)}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>
        {/* <button className="lk-btn-ol md toggle quick-title">
          <FontAwesomeIcon icon="bolt" className="ic on-l"/>
          <span>Quick Search</span>
        </button> */}
      </div>
    )
  }
}
export default SearchHeader;

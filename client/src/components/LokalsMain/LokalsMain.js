import React, { Component } from 'react'
import Axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeTitle } from '../../util/stringFormat';
import isEmpty from '../../util/is-empty'
import SearchHeader from './sub/SearchHeader';
import LimitedMod from './sub/LimitedMod';
import RowContent from './sub/RowContent';
import Clock from './sub/Clock';
import MiniMap from './sub/MiniMap';

import './LokalsMain.css'
import { getSearchResults } from '../../actions/searchActions';

const DUMMY_USER = {
  pref: {
    areas: ['Financial District', 'Cow Hollow', 'Nob Hill', 'SOMA'],
    kws: ['Thai', 'Japanese', 'Wine', 'Italian', 'Coffee', 'Salad'],
    local: 'san francisco'
  }
}
const DUMMY_FEEDING = [
  { title: "Bon Appetit!", kw: ['French'], lc: {address: 'financial district',type:'neighborhood'} },
  { title: "Wine Bars are all Around", kw: ['Wine'], lc: {address: 'all',type:'none'} },
  { title: "Sushi all day", kw: ['japanese'], lc: {address: 'all',type:'none'} },
  { title: "Drink hard, Play hard but Don't drive", kw: ['Bar'], lc: {address: 'all',type:'none'} }
]
class LokalsMain extends Component {
  state = {
    h: null,
    m: null,
    weather: null,
    markers: null,
    activePopup: 9,
    currentCenter: null,
    darktheme: false,
    kw: '',
    lc: '',
    ct: 'san francisco',
    opn: false,
    searchResults: null,
    currentKw: 'wine',
    currentLc: {
      address: 'all',
      type: 'none'
    },
    userprefLc: null,
  }

  componentDidMount() {
    this.setState({
      ct: DUMMY_USER.pref.local,
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.app!==this.props.app) {
      this.setState({
        ct: this.props.app.local.city
      })
    }
  }
  
  queryBusinesses(keyword, location, city) {
    this.props.getSearchResults(keyword, location, city);
    Axios.get(`/api/business/querybusinesses/categories/${keyword}/${location.address}/${location.type}/${city}`)
      .then(res => {
        return this.setState({
          markers: res.data, 
          searchResults: res.data,
          currentKw: keyword,
          currentLc: location,
          currentCenter: location
        });
      })
      .catch(err => { if (err) console.log({error: err.response})});
  }
  getNearbyPlaces(keyword, type, location, radius, opennow) {
    // const sf = {lat: 37.7749, lng: -122.4194};
    const { ct } = this.state;
    const params = {};
    params.kw = keyword || 'all';
    params.ty = type || 'restaurant';
    params.lc = !isEmpty(location) ? location : 'downtown';
    params.rad = radius || 1000;
    params.opn = opennow;
    params.ct = ct;
    Axios.get(`/api/business/searchnearby/${params.kw}/${params.ty}/${params.lc}/${params.ct}/${params.rad}/${params.opn}`)
      .then(res => {
        return this.setState({
          markers: res.data, 
          searchResults: res.data,
          currentKw: params.kw,
          currentLc: params.lc,
          currentCenter: location
        });
      })
      .catch(err => console.log({error: 'An unknown error occor!'}));
  }
  onChange(e,value) {
    e.preventDefault();
    if (value) {
      this.setState({[e.target.name]:value});
    } else {
      this.setState({[e.target.name]:e.target.value});
    }
  }
  onClearText(e,key) {
    e.preventDefault();
    this.setState({[key]:''})
  }
  onSearch(e) {
    e.preventDefault();
    const { lc, kw, ct } = this.state;
    if (isEmpty(lc)) {
      this.queryBusinesses(kw, {address: 'all', type: 'none'}, ct)
    } else {
      this.queryBusinesses(kw, {address: lc, type: 'neighborhood'}, ct)
    }
    
  }
  render() {
    const { darkTheme, kw, lc, ct, opn, searchResults, currentKw, currentLc } = this.state;
    const { app, search } = this.props;
    // console.log(search);
    var keywords = DUMMY_USER.pref.kws;
    var locations = DUMMY_USER.pref.areas;
    return (
      <div className={darkTheme?`page-container dark-th`:"page-container"}>
        <div className="lokals-main">
          <SearchHeader 
            prefKw={keywords} 
            prefLc={locations} 
            kw={kw} 
            lc={lc}
            opn={opn}
            onChange={(e, value)=>this.onChange(e, value)}
            onChangeAddress={(e)=>this.onChangeAddress(e)}
            onClearText={(e, key)=>this.onClearText(e,key)}
            onSearch={(e)=>this.onSearch(e)}
          />
          <div className="lokals-feed">
            { (search.businessResults) && (
              <div className="feed-content pd-common result">
                <div className="comm-feature">
                  {search.businessResults.length > 0 ? (
                  <div className="mdl-bound sugg-list">
                    <h5 className="mdl-tt flx al-c">
                      <span className="mr-3 result-text"><span className="result-number">{search.businessResults.length}</span>{` results for "${currentKw}"`} {currentLc.address!=='all' && ` in "${currentLc.address}"`}</span>
                      <span className="lk-btn btn-war sm tx-cap mr-2">{currentLc.address}</span>
                      <span className="lk-btn-ol sm tx-cap mr-2">{currentKw}</span>
                    </h5>
                    <div className="mdl">
                      <RowContent
                        col="4"
                        ct={app.local.city}
                        ckw={currentKw}
                        clc={currentLc}
                        data={search.businessResults}
                      />
                    </div>
                  </div>):(
                    <div className="mdl-bound sugg-list flx al-c jt-c">
                      <h5 className="no-result"><span>{`No Results for "${currentKw}"`} {currentLc.address!=='all' && ` in ${currentLc.address}`}</span></h5>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="feed-header pd-common">
              <div className="group">
                <div className="flx al-c jt-spbt">
                  <Clock classname="time-disp mr-2"/>
                  <button className="lk-btn-ol ml-42 sm th-btn mb-1" id="theme-btn" onClick={(e)=>this.setState({darkTheme: !darkTheme})}><FontAwesomeIcon icon={darkTheme?"sun":"moon"} className="ic on-l"/>
                    {darkTheme?"Light Mode":"Dark Mode"}
                  </button>
                </div>
                <h4 className="feed-hd-tx">What happening now in {makeTitle(ct)}</h4>
                <div className="line-sep-h"></div>
              </div>
            </div>
            <div className="feed-content pd-common">
              <div className="top-feature flx jt-spbt">
                <LimitedMod 
                  city={'san francisco'}
                />
                <MiniMap 
                  markers={search.businessResults}
                  kw={currentKw}
                  lc={currentLc}
                  ct={app.local.city}
                  cMapCen={search.query.currentCenter}
                />
              </div>
              <div className="comm-feature">
                <div className="mdl-bound sugg-list">
                  <h5 className="mdl-tt flx al-c">
                    <span className="mr-3">{DUMMY_FEEDING[0].title}</span>
                    <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(DUMMY_FEEDING[0].lc.address)}</span>
                    {DUMMY_FEEDING[0].kw.map((k,i)=>(
                      <div style={{display: 'inline-block'}} key={i}>
                        <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(k)}</span>
                      </div>
                    ))}
                  </h5>
                  <div className="mdl">
                    <RowContent
                      col="4"
                      clc={DUMMY_FEEDING[0].lc}
                      ct={app.local.city}
                      ckw={DUMMY_FEEDING[0].kw}
                      autoMount={true}
                      searchInput={DUMMY_FEEDING[0]}
                    />
                  </div>
                </div>
                <div className="mdl-bound sugg-list">
                  <h5 className="mdl-tt flx al-c">
                    <span className="mr-3">{DUMMY_FEEDING[1].title}</span>
                    <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(DUMMY_FEEDING[1].lc.address)}</span>
                    {DUMMY_FEEDING[1].kw.map((k,i)=>(
                      <div style={{display: 'inline-block'}} key={i}>
                        <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(k)}</span>
                      </div>
                    ))}
                  </h5>
                  <div className="mdl">
                    <RowContent
                      col="4"
                      ct={app.local.city}
                      clc={DUMMY_FEEDING[1].lc}
                      ckw={DUMMY_FEEDING[1].kw}
                      autoMount={true}
                      searchInput={DUMMY_FEEDING[1]}
                    />
                  </div>
                </div>
              </div>          
            </div>
            <div className="feed-content on-dk mb-2">
              <div className="hlite-feature pd-common">
                <div className="mdl-bound sugg-list">
                  <h5 className="mdl-tt flx al-c">
                    <span className="mr-4">{DUMMY_FEEDING[2].title}</span>
                    <span className="lk-btn btn-dan sm mr-2">
                      <FontAwesomeIcon icon="star" className="ic on-l"/>
                      Highly Recommend
                    </span>
                    <span className="lk-btn btn-war sm mr-2">{makeTitle(DUMMY_FEEDING[2].lc.address)}</span>
                    {DUMMY_FEEDING[2].kw.map((k,i)=>(
                      <div style={{display: 'inline-block'}} key={i}>
                        <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(k)}</span>
                      </div>
                    ))}
                  </h5>
                  <div className="mdl">
                    <RowContent
                      col="4"
                      onDark={true}
                      ct={app.local.city}
                      clc={DUMMY_FEEDING[2].lc}
                      ckw={DUMMY_FEEDING[2].kw}
                      autoMount={true}
                      searchInput={DUMMY_FEEDING[2]}
                    />
                  </div>
                </div>
              </div>
            </div>  
            <div className="feed-content pd-common">
              <div className="comm-feature">
                <div className="mdl-bound sugg-list">
                  <h5 className="mdl-tt flx al-c">
                    <span className="mr-3">{DUMMY_FEEDING[3].title}</span>
                      <span className="lk-btn btn-war sm tx-cap mr-2">{makeTitle(DUMMY_FEEDING[3].lc.address)}</span>
                    {DUMMY_FEEDING[3].kw.map((k,i)=>(
                      <div style={{display: 'inline-block'}} key={i}>
                        <span className="lk-btn-ol sm tx-cap mr-2">{makeTitle(k)}</span>
                      </div>
                    ))}
                  </h5>
                  <div className="mdl">
                    <RowContent
                      col="4"
                      ct={app.local.city}
                      clc={DUMMY_FEEDING[3].lc}
                      ckw={DUMMY_FEEDING[3].kw}
                      autoMount={true}
                      searchInput={DUMMY_FEEDING[3]}
                    />
                  </div>
                </div>
                {/* <div className="mdl-bound sugg-list">
                  <h5 className="mdl-tt flx al-c"><span>Wine Bars All Around</span></h5>
                  <div className="mdl">
                    <RowContent
                      col="4"
                      data={[{name:'name'},{name:'name'},{name:'name'},{name:'name'},{name:'name'},{name:'name'},{name:'name'},{name:'name'}]}
                    />
                  </div>
                </div> */}
              </div> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LokalsMain.propTypes = {
  app: PropTypes.object.isRequired
}

var mapStateToProps = state => ({
  app: state.app,
  user: state.user,
  search: state.search
})

export default connect( mapStateToProps, { getSearchResults })(LokalsMain);

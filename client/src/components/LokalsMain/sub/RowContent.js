import React, { Component } from 'react'
import { connect } from 'react-redux';

import Axios from 'axios';

// import { capitalize, makeTitle } from '../../../util/stringFormat';
// import { switchIcon } from '../../../util/switchIcon';
import isEmpty from '../../../util/is-empty'
import './RowContent.css';
// import ContentCard from './ContentCard';
import LokalsCard from './LokalsCard';
import { getSearchResults } from '../../../actions/searchActions';

class RowContent extends Component {
  state = {
    moveRight: 0,
    translate: 0,
    hoverIndex: 0,
    searchInput: null,
    data: [],
    following: [],
  }
  componentDidMount() {
    const { searchInput, ct, autoMount } = this.props;
    if (autoMount) {
      Axios.get(`/api/business/querybusinesses/categories/${searchInput.kw}/${searchInput.lc.address}/${searchInput.lc.type}/${ct}`)
        .then(res => {
          this.setState({
            data: res.data.businesses
          })
        })
        .catch(err => { if (err) console.log({error: err.response})});
    } else {
      this.setState({
        data: this.props.data
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ct !== this.props.ct) {
      const { ct, clc, ckw } = this.props;
      Axios.get(`/api/business/querybusinesses/categories/${ckw}/${clc.address}/${clc.type}/${ct}`)
        .then(res => {
          this.setState({
            data: res.data.businesses
          })
        })
        .catch(err => { if (err) console.log({error: err.response})});
    } else if (prevProps.data !== this.props.data) {
      this.setState({
        data: this.props.data
      });
    }
  }
  
  getNearbyPlaces(input, city, radius, opennow) {
    const params = {};
    params.kw = input.kw.join(' ');
    params.ty = 'restaurant';
    params.lc = !isEmpty(input.lc) ? input.lc : 'downtown';
    params.rad = radius || 1000;
    params.opn = opennow;
    params.ct = city;
    Axios.get(`/api/business/searchnearby/${params.kw}/${params.ty}/${params.lc}/${params.ct}/${params.rad}/${params.opn}`)
      .then(res => {
        return this.setState({
          searchInput: input,
          data: res.data, 
          searchResults: res.data
        });
      })
      .catch(err => console.log({error: err.reponse.data}));
  }
  onNavigate(e, direction) {
    e.preventDefault();
    const numOfColumn = this.props.col;
    const {moveRight, data} = this.state;
    if (direction === 'right' && moveRight < data.length-numOfColumn) {
      this.setState({translate: -(100/numOfColumn) * (moveRight+1), moveRight: moveRight+1})
    } else if (direction === 'left' && moveRight > 0) {
      this.setState({translate: -(100/numOfColumn) * (moveRight-1), moveRight: moveRight-1})
    }
  }
  render() {
    const { col, onDark } = this.props;
    const { hoverIndex, following, data } = this.state;
    return (
      <div className="section-container">
        <div className="section-content" style={{transform: `translateX(${this.state.translate}%)`}}>
          {data && data.map((d, i) => (
            <span style={{width: `${100/col}%`}} key={i} className="chain-container">
              <LokalsCard
                index={i}
                data={d}
                following={following}
                onDark={onDark}
                turnOffImg={false}
              />
            </span>
          ))}
        </div>
        <div className="navigate-btn">
          {/* <span onClick={(e)=>this.onNavigate(e, 'left')} className={moveRight===0?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-left"/>
          </span> */}
          { data && (<span className="dot-navigator">
            {Array.from('d'.repeat(data.length)).map((classname, i) => (
              <div className={`${classname} ${i >= hoverIndex?'':'scaled'}`} key={i}></div>
            ))}
          </span>)}
          {/* <span onClick={(e)=>this.onNavigate(e, 'right')} className={moveRight+col===data.length?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-right"/>
          </span> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  search: state.search
})

export default connect( mapStateToProps, { getSearchResults })(RowContent);

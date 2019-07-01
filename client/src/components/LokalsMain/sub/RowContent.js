import React, { Component } from 'react'
import Axios from 'axios';

// import { capitalize, makeTitle } from '../../../util/stringFormat';
// import { switchIcon } from '../../../util/switchIcon';
import isEmpty from '../../../util/is-empty'
import './RowContent.css';
import ContentCard from './ContentCard';

// function getImgUrl(ref) {
//   var randomNum = Math.floor(Math.random() * (31 - 23)) + 23;
//   console.log(randomNum);
//   const num = randomNum.toString();
//   return `/images/img-${num}.jpg`;
//   // return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_MAP_API}`;
// }
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
    // console.log(searchInput);
    if (autoMount) {
      this.getNearbyPlaces(searchInput, ct, 1000, false)
    } else {
      this.setState({
        data: this.props.data
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ct !== this.props.ct) {
      const { ct, ckw } = this.props;
      // const searchInput = { kw:ckw, lc:clc }
      console.log(ckw)
      this.getNearbyPlaces({ kw:ckw, lc: '' }, ct, 1000, false)
    } else if (prevProps.data !== this.props.data) {
      console.log(this.props.data)
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
          {data.map((d, i) => (
            <span style={{width: `${100/col}%`}} key={i} className="chain-container">
              <ContentCard
                index={i}
                data={d}
                following={following}
                onDark={onDark}
              />
              {/* <div className={`card-container sm`}> 
                <div className="top-info"
                  id={d.photos && d.photos[0].photo_reference}
                  style={ d.photos &&
                    { 
                      backgroundImage: `url(${getImgUrl(d.photos[0].photo_reference)})`,
                      backgroundSize: (d.photos[0].width / d.photos[0].height > 1.34) ? `auto 100%`:`100% auto`
                    }
                  }
                >
                  <div className="biz-type">
                    Wine Bar
                  </div>
                  <div className="card-buttons">
                    <span className={`lk-tag-btn sm rm-m on-img ${following.includes(i)?"selected":""} ${onDark?"on-dk":""}`}
                      onClick={(e)=>this.setState({following:following.concat(i)})}
                    >
                      <span>{following.includes(i)?'Following':'Follow'}</span>
                      <FontAwesomeIcon icon={following.includes(i)?"check":"plus"} className="ic on-r"/>
                    </span>
                  </div>
                </div>
                <div className="footer-info">
                  <h6 className="desc head flx jt-spbt al-st">
                    <span className="name">{d.name?d.name:'Business Name'}
                    </span>
                  </h6>
                  <p className="desc first">
                    <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
                    <span className="st">{d.vicinity}</span>
                    <span>, </span>
                    <span className="nbhood">Cow Hollow</span>
                  </p>
                  <p className="desc second flx jt-spbt">
                    <span className="dist">
                      <FontAwesomeIcon icon="utensils" className="ic on-l"/>
                      <span>{d.types && d.types[0]}</span>
                      <span> • </span>
                      <span className="pri-cus">{'$'.repeat(d.price_level)}</span>
                    </span>
                    <span className="rating">
                      <FontAwesomeIcon icon="thumbs-up" className="ic on-l"/>
                      <span>{d.user_ratings_total}</span>
                    </span> 
                  </p>
                </div>
                <div className="vignette bottom"></div>
              </div> */}
            </span>
          ))}
        </div>
        <div className="navigate-btn">
          {/* <span onClick={(e)=>this.onNavigate(e, 'left')} className={moveRight===0?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-left"/>
          </span> */}
          <span className="dot-navigator">
            {Array.from('d'.repeat(data.length)).map((classname, i) => (
              <div className={`${classname} ${i >= hoverIndex?'':'scaled'}`} key={i}></div>
            ))}
          </span>
          {/* <span onClick={(e)=>this.onNavigate(e, 'right')} className={moveRight+col===data.length?"direction-btn hidden":"direction-btn"}>
            <FontAwesomeIcon icon="arrow-right"/>
          </span> */}
        </div>
      </div>
    )
  }
}
export default RowContent;

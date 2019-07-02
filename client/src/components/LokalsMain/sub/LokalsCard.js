import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GOOGLE_MAP_API } from '../../../config/keys';
import { makeTitle } from '../../../util/stringFormat';

 class LokalsCard extends Component {
  render() {
    const { data, following, onDark, index } = this.props;
    return (
      <div className={`card-container sm`}> 
        <div className="top-info"
          style={ data.cover_photo.third_party && { 
            backgroundImage: `url('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.cover_photo.photo_reference}&key=${'AIzaSyABR-OotFMskoGoPXOQ4LYUhb6ChUvnnPM'}')`,
            backgroundSize: (data.cover_photo.width / data.cover_photo.height > 1.34) ? `auto 105%`:`105% auto`
          }}
        >
          <div className="biz-type">
            {/* {makeTitle(data.business_type)} */}
          </div>
          <div className="card-buttons">
            <span className={`lk-tag-btn sm rm-m on-img ${following.includes(index)?"selected":""} ${onDark?"on-dk":""}`}
              onClick={(e)=>this.setState({following:following.concat(index)})}
            >
              <span>{following.includes(index)?'Following':'Follow'}</span>
              <FontAwesomeIcon icon={following.includes(index)?"check":"plus"} className="ic on-r"/>
            </span>
          </div>
        </div>
        <div className="footer-info">
          <h6 className="desc head flx jt-spbt al-st">
            <span className="name">{data && data.business_name}
            {/* <FontAwesomeIcon icon="wine-glass-alt" className="ic on-r"/> */}
            </span>
          </h6>
          <p className="desc first">
            <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
            <span className="st">{data && data.address.street}</span>
            <span>, </span>
            <span className="nbhood">{data.address.neighborhood}</span>
          </p>
          <p className="desc second flx jt-spbt">
            <span className="dist">
              <FontAwesomeIcon icon={data && data.categories.slice(0,1)[0].keyword.match(/wine/i)?"wine-glass-alt":"utensils"} className="ic on-l"/>
              {data && data.categories.slice(0,1).map((cat,i)=>(
                <span key={i}><span className="lk-link">{makeTitle(cat.keyword)}</span><span></span></span>
              ))}
              <span> • </span>
              { data && <span className="pri-cus">{(data.price && data.price.level > 0 ) ? '$'.repeat(data.price.level):'N/A'}</span>}
            </span>
            <span className="rating">
              <FontAwesomeIcon icon={['fab', 'google']} className="ic on-l gg"/>
              <span>{data && data.google_rating}</span>
            </span> 
          </p>
        </div>
        <div className="vignette bottom"></div>
      </div>   
    )
  }
}
export default LokalsCard;
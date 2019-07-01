import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GOOGLE_MAP_API } from '../../../config/keys';

export default function ContentCard(props) {
  const { data, following, onDark, index } = props
  const getImgUrl = function(ref) {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${GOOGLE_MAP_API}`;
  }
  // var randomImg = `/images/img-${Math.floor(Math.random() * (30 - 17)) + 17}.jpg`;
  return (
    <div className={`card-container sm`}> 
      <div className="top-info"
        style={ data.photos &&{ 
          backgroundImage: `url('${getImgUrl(data.photos[0].photo_reference)}')`,
          backgroundSize: (data.photos[0].width / data.photos[0].height > 1.34) ? `auto 105%`:`105% auto`
        }}
      >
        <div className="biz-type">
          {data.types && data.types[0]}
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
                    <span className="name">{data.name?data.name:'Business Name'}
                    {/* <FontAwesomeIcon icon="check" className="ic on-r"/> */}
                    </span>
                  </h6>
                  <p className="desc first">
                    <FontAwesomeIcon icon="map-marker-alt" className="ic on-l"/>
                    <span className="st">{data.vicinity}</span>
                    {/* <span>, </span>
                    <span className="nbhood">Cow Hollow</span> */}
                  </p>
                  <p className="desc second flx jt-spbt">
                    <span className="dist">
                      <FontAwesomeIcon icon="utensils" className="ic on-l"/>
                      <span>{data.types && data.types[0]}</span>
                      <span> • </span>
                      <span className="pri-cus">{'$'.repeat(data.price_level)}</span>
                    </span>
                    <span className="rating">
                      <FontAwesomeIcon icon="thumbs-up" className="ic on-l"/>
                      <span>{data.user_ratings_total}</span>
                    </span> 
                  </p>
                </div>
                <div className="vignette bottom"></div>
              </div>
            
  )
}

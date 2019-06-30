import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireAlt } from '@fortawesome/free-solid-svg-icons'
import './LokalsLogo.css';

library.add(faFireAlt);

const LokalsLogo = (props) => {
  return (
      <span className="lokals-logo" style={props.styles && {...props.styles}}>
        L<span><FontAwesomeIcon icon="fire-alt"/></span>KALS
      </span>
  )
}

export default LokalsLogo

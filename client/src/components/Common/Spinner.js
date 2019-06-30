import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components'

export default function Spinner(props) {
  const Spinner = props.cssStyle ? styled.div`
    display: block;
    top: ${props.cssStyle.top || 'initial'};
    right: ${props.cssStyle.right || 'initial'};
    bottom: ${props.cssStyle.bottom || 'initial'};
    left: ${props.cssStyle.left || 'initial'};
    position: ${props.cssStyle.position || 'absolute'};
    width: ${props.cssStyle.width || '100%'};
    height: ${props.cssStyle.height || '100%'};
    text-align: center;
    font-size: 1.4em;
    background: transparent;
    color: ${props.cssStyle.color};
    ${ props.cssStyle.transform && 'transform:'+props.cssStyle.transform+';' }
  `:
  styled.div`
    display: block;
    position: ${'relative'};
    width: ${'100%'};
    height: ${'100%'};
    text-align: center;
    font-size: 1.4em;
    background: transparent;
    color: black;
  `;
  return (
    <Spinner>
      <FontAwesomeIcon icon="spinner" spin/>
    </Spinner>
  )
}

import React from 'react'
import styled, {css} from 'styled-components';

const CoinImageWrapper = styled.img`
  height: 50px;

  ${props => props.spotlight && css`
    height: 200px;
    margin: auto;
    display: block;
  `}
`;

export default function CoinImage({coin, spotlight}) {
  return <CoinImageWrapper
    alt={coin.CoinSymbol}
    spotlight={spotlight}
    src={`http://cryptocompare.com/${
      coin.ImageUrl
    }`}
  />
};


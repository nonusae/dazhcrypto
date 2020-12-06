import React from 'react'
import styled, { css } from 'styled-components';
import { SelectableTile } from "../Shared/Tile";
import { fontSize3, fontSizeBig } from '../Shared/Styles';
import { CoinHeaderGridStyled } from '../Settings/CoinHeaderGrid';

const  JustifyRight = styled.div`
  justify-self: right;
`

const  JustifyLeft = styled.div`
  justify-self: left;
`

const TickerPrice = styled.div`
  ${fontSizeBig};
`;

const ChangePct = styled.div`
  color: green;
  ${props => props.red && css`
    color: red;
  `};
`;

const numberFormat = number => {
  return +(number + '').slice(0, 7);
}

const PriceTiledStyled = styled(SelectableTile)`
  ${props => props.compact && css`
    display: grid;
    ${fontSize3};
    grid-gap: 5px;
    grid-template-columns: repeat(3, 1fr);
    justify-items: right;
  `}
`;

function ChangePercent({data}){
  return (
    <JustifyRight>
      <ChangePct red={data.CHANGEPCT24HOUR < 0}>
        {numberFormat(data.CHANGEPCT24HOUR)}
      </ChangePct>
    </JustifyRight>
  );
}

function PriceTileHighLight({sym, data}){
  return (
    <PriceTiledStyled>
      <CoinHeaderGridStyled>
        <div> {sym} </div>
        <ChangePercent data={data}/>
      </CoinHeaderGridStyled>
      <TickerPrice>
        ${numberFormat(data.PRICE)}
      </TickerPrice>
    </PriceTiledStyled>
  )
}

function PriceTileCompact({sym, data}) {
  return (
    <PriceTiledStyled compact>
      <JustifyLeft> {sym} </JustifyLeft>
      <ChangePercent data={data}/>
      <div>
        ${numberFormat(data.PRICE)}
      </div>
    </PriceTiledStyled>
  )
}

export default function PriceTile({price, index}) {
  let sym = Object.keys(price)[0];
  let data = price[sym]['USD']
  let TileClass = index <  5 ? PriceTileHighLight : PriceTileCompact
  return(
    <TileClass sym={sym} data={data} />
  )
};

import highchartsConfig from './HighchartsConfig';
import React from 'react';
import { Tile } from "../Shared/Tile";
import { AppContext } from "../App/AppProvider";
import ReactHighCharts from 'react-highcharts';
import theme from './HighChartsTheme'

ReactHighCharts.Highcharts.setOptions(theme)

export default function PriceChart(params) {
  return(
    <AppContext.Consumer>
      {({}) =>
        <Tile>
          <ReactHighCharts config={highchartsConfig()}/>
        </Tile>
      }
    </AppContext.Consumer>
  )
};


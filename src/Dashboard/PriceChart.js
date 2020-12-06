import highchartsConfig from './HighchartsConfig';
import React from 'react';
import { Tile } from "../Shared/Tile";
import { AppContext } from "../App/AppProvider";
import ReactHighCharts from 'react-highcharts';
import ChartSelect from './ChartSelect';
import theme from './HighChartsTheme'

ReactHighCharts.Highcharts.setOptions(theme)

export default function PriceChart(params) {
  return(
    <AppContext.Consumer>
      {({historical, changeChartSelect}) =>
        <Tile>
          <ChartSelect
            defaultValue={"months"}
            onChange={e => changeChartSelect(e.target.value)}
          >
            <option value="days"> Day </option>
            <option value="weeks"> Weeks </option>
            <option value="months"> Months </option>
          </ChartSelect>
          {historical ?
            <ReactHighCharts config={highchartsConfig(historical)}/>
            : <div> Loading Historical Data </div>
          }
        </Tile>
      }
    </AppContext.Consumer>
  )
};


import React from 'react';
import _ from 'lodash';
import moment from 'moment';
const cc = require('cryptocompare')


export const AppContext = React.createContext();

const MAX_FAVORITES = 10;
const TIME_UNITS = 10;

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'dashboard',
      favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
      ...this.savedSettings(),
      setPage: this.setPage,
      addCoin: this.addCoin,
      removeCoin: this.removeCoin,
      isInFavorites: this.isInFavorites,
      confirmFavorites: this.confirmFavorites,
      setFilteredCoins: this.setFilteredCoins,
      setCurrentFavorite: this.setCurrentFavorite
    }
  }

  componentDidMount = () => {
    this.fetchCoin();
    this.fetchPrices();
    this.fetchHistorical();
  }

  fetchCoin = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({coinList});
  }

  fetchHistorical = async () => {
    if (this.state.firstVisit) return;
    let result = await this.historical();
    let historical = [
      {
        name: this.state.currentFavorite,
        data: result.map((ticker, index) => [
          moment().subtract({month: TIME_UNITS - index}).valueOf(),
          ticker.USD
        ])
      }
    ]
    this.setState({historical})
  }

  addCoin = key => {
    let favorites = [...this.state.favorites];
    if(favorites.length < MAX_FAVORITES) {
      favorites.push(key);
      this.setState({favorites});
    }
  }

  removeCoin = key => {
    let favorites = [...this.state.favorites];
    this.setState({favorites: _.pull(favorites, key)});
  }

  isInFavorites = key => {
    return (_.includes(this.state.favorites, key));
  }

  fetchPrices = async () => {
    if(this.state.firstVisit) return;
    let prices = await this.prices();
    prices = prices.filter(price => Object.keys(price).length);
    this.setState({prices});
  }

  prices = async () => {
    let returnData = [];
    for (let i = 0; i < this.state.favorites.length; i++) {
      try {
        let priceData = await cc.priceFull(this.state.favorites[i], 'USD')
        returnData.push(priceData)
      } catch (e){
        console.warn('Fetch price error:', e);
      }
    }

    return returnData;
  }

  historical = () => {
    let promises = [];
    for (let units = TIME_UNITS;  units > 0; units--) {
      promises.push(
        cc.priceHistorical(
          this.state.currentFavorite,
          ['USD'],
          moment()
          .subtract({month: units})
          .toDate()
        )
      )
    }

    return Promise.all(promises)
  }

  confirmFavorites = () => {
    let currentFavorite = this.state.favorites[0];

    this.setState({
      firstVisit: false,
      currentFavorite,
      page: 'dashboard',
      price: null,
      hhistorical: null,
    }, () => {
      this.fetchPrices();
      this.fetchHistorical();
    });
    localStorage.setItem('dazhCrypto', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
    }))
  }

  setPage = page => this.setState({page})

  setFilteredCoins = (filteredCoins) => this.setState({filteredCoins})

  setCurrentFavorite = (sym) => {
    this.setState({
      currentFavorite: sym,
      historical: null,
    }, this.fetchHistorical);

    localStorage.setItem('dazhCrypto', JSON.stringify({
      ...JSON.parse(localStorage.getItem('dazhCrypto')),
      currentFavorite: sym
    }))
  }

  savedSettings() {
    let dashboardData = JSON.parse(localStorage.getItem('dazhCrypto'));
    if(!dashboardData) {
      return { page: 'settings', firstVisit: true };
    }
    let {favorites, currentFavorite} = dashboardData;
    return {favorites, currentFavorite};
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

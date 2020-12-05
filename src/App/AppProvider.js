import React from 'react';

export const AppContext = React.createContext();

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'dashboard',
      ...this.savedSettings(),
      setPage: this.setPage,
      confirmFavorites: this.confirmFavorites
    }
  }

  confirmFavorites = () => {
    this.setState({
      firstVisit: false,
      page: 'dashboard'
    });
    localStorage.setItem('dazhCrypto', JSON.stringify({
      test: 'hello',
    }))
  }

  setPage = page => this.setState({page})

  savedSettings() {
    let dashboardData = JSON.parse(localStorage.getItem('dazhCrypto'));
    if(!dashboardData) {
      return { page: 'settings', firstVisit: true };
    }
    return {};
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    )
  }
}

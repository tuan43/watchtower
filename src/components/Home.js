import React, { Component } from 'react';

class Home extends Component {
  constructor() {
    super();
    this.state = { authKey: null };
  }

  componentDidMount() {
    fetch('/api/authenticated', {
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    }).then(res => res.json())
      .then(res => this.setState({ authKey: res.authKey }))
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h2>Authenticated!!!</h2>
        {this.state.authKey}
      </div>
    );
  }
}

export default Home;

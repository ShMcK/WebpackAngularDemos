class NavCtrl {
  constructor() {
    this.app = require('index.json');
  }
}

export default () => {
  require('./nav.scss');
  return {
    controller: NavCtrl,
    controllerAs: 'nav',
    template: require('./nav.html')
  };
};
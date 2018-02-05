import Component, { tracked } from '@glimmer/component';

export default class Sidebar extends Component {
  selectItem(item) {
    this.args.onSelectItem(item);
  }
}
import Component, { tracked } from '@glimmer/component';

export default class EachItem extends Component {
  @tracked('args')
  get items() {
    let source = this.args.in;
    return Object.keys(source)
      .map(key => ({ key, value: source[key] }));
  }
}
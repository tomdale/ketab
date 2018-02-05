import Component, { tracked } from '@glimmer/component';
import { IApiPackage, IApiClass, IApiFunction, IApiEnumMember, IApiInterface } from '@microsoft/api-extractor';

async function fetchPackages() {
  let requests = ['application', 'component']
    .map(pkg => fetch(`/${pkg}.api.json`))

  let json = (await Promise.all(requests))
    .map(r => r.json());

  let packages = (await Promise.all(json))
    .map(json => new Package(json));

  return packages;
}
export default class Ketab extends Component {
  @tracked packages: Package[] = [];
  @tracked selectedItem: Package;

  async didInsertElement() {
    this.packages = await fetchPackages();
    this.selectedItem = this.packages[0];
    console.log(this.packages);
  }

  selectItem(item) {
    this.selectedItem = item;
  }
}

class Package {
  name: string;
  kind: 'package';
  classes: Class[] = [];
  functions: IApiFunction[] = [];
  interfaces: IApiInterface[] = [];
  exports: any[] = [];

  constructor(pkg: IApiPackage) {
    this.name = pkg.name;
    this.kind = 'package';

    let exports = Object.keys(pkg.exports);

    for (let key of exports) {
      let symbol = pkg.exports[key];
      symbol['name'] = key;

      switch (symbol.kind) {
        case 'class':
          let klass = new Class(key, symbol);
          this.classes.push(klass);
          this.exports.push(klass);
          break;
        case 'interface':
          this.interfaces.push(symbol);
          this.exports.push(symbol);
          break;
        case 'function':
          this.functions.push(symbol);
          this.exports.push(symbol);
          break;
      }
    }
  }
}

class Class {
  name: string;
  kind: 'class';
  extends: string;
  implements: string;
  methods: any[] = [];
  properties: any[] = [];
  konstructor: any;
  summary: any;
  remarks: any;

  constructor(name: string, klass: IApiClass) {
    this.name = name;
    this.kind = 'class';
    this.extends = klass.extends;
    this.implements = klass.implements;
    this.summary = klass.summary;
    this.remarks = klass.remarks;

    let members = Object.keys(klass.members);

    for (let key of members) {
      let member = klass.members[key];
      (member as any).name = key;
      switch (member.kind) {
        case 'constructor':
          this.konstructor = member;
          break;
        case 'property':
          this.properties.push(member);
          break;
        case 'method':
          this.methods.push(member);
          break;
      }
    }
  }
}

class Member {
  name: string;
}
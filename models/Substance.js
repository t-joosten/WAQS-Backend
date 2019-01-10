export default class Substance {
  constructor() {
    this.substances = {
      1: 'Temperatuur',
      2: 'pH',
      3: 'Zuurstof',
      4: 'Fosfaat',
      5: 'Ammonium',
      6: 'Waterpeil',
      7: 'Stikstof',
      8: 'Deining',
      9: 'Geleiding',
      10: 'Blauwalg',
      11: 'Licht',
      12: 'Fosfor',
      13: 'Stroming',
    };
  }

  getSubstanceById(id) {
    return this.substances[id];
  }
}

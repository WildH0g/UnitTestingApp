// jshint esversion: 8
/*
 * Takes a 2D array and converts it to an HTML <table>S
 */
class ArrayToHtml {
  constructor(array) {
    this.code = array.reduce((table, row, i) => {
        let _tableRow = '';
        _tableRow += '<tr>';
        row.forEach((cell) => (_tableRow += `<t${i === 0 ? 'h' : 'd'}>${cell}</t${i === 0 ? 'h' : 'd'}>`));
        _tableRow += '</tr>';
        return table + _tableRow;
      }, '<table border="1" cellspacing="1" cellpadding="1">') + '</table>';
    return this;
  }
}

if (typeof module !== 'undefined') module.exports = ArrayToHtml;
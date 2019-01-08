module.exports = {
  hex2bin(hex) {
    return (parseInt(hex, 16).toString(2)).padStart(8, '0');
  },
  bin2dec(bin) {
    return parseInt(bin, 2);
  },
  hex2dec(hex) {
    return parseInt(hex, 16);
  },
};

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
  sumHexString(hex1, hex2) {
    const hexStr = (parseInt(hex1, 16) + parseInt(hex2, 16)).toString(16);
    return hexStr;
  },
};

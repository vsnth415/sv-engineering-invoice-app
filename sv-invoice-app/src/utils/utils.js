// Number to Words (with Paise)
export const numberToWords = (amount) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (isNaN(amount)) return "Invalid amount";

  const number = parseFloat(amount).toFixed(2);
  const [rupeesPart, paisePartRaw] = number.split(".");
  const rupees = parseInt(rupeesPart, 10);
  const paise = parseInt(paisePartRaw.padEnd(2, "0").slice(0, 2), 10);

  const convert = (num) => {
    if (num === 0) return "Zero";

    const n = ("000000000" + num)
      .slice(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

    if (!n) return "";

    let str = "";

    const getWords = (val) => {
      if (val === 0) return "";
      if (val < 20) return a[val];
      return (
        b[Math.floor(val / 10)] + (val % 10 !== 0 ? " " + a[val % 10] : "")
      );
    };

    if (Number(n[1]) > 0) str += getWords(Number(n[1])) + " Crore ";
    if (Number(n[2]) > 0) str += getWords(Number(n[2])) + " Lakh ";
    if (Number(n[3]) > 0) str += getWords(Number(n[3])) + " Thousand ";
    if (Number(n[4]) > 0) str += getWords(Number(n[4])) + " Hundred ";
    if (Number(n[5]) > 0)
      str += (str ? "and " : "") + getWords(Number(n[5])) + " ";

    return str.trim();
  };

  let result = "";
  if (rupees > 0) result += convert(rupees) + " Rupees";
  if (paise > 0) result += (result ? " and " : "") + convert(paise) + " Paise";
  if (!result) result = " Zero Rupees";

  return result + " Only";
};

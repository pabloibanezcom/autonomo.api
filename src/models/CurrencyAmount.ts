const CurrencyAmount = {
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  baseCurrencyRate: { type: Number }
};

export default CurrencyAmount;

const AmountCurrency = {
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  primaryCurrencyRate: { type: Number }
};

export default AmountCurrency;

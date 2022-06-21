import { cutTrailingZeroes, separateDecimals, separateFractions } from "./regexFormatting";

describe('TestingRegexFormatting', () => {
  const rawNumber = "990099000000364464707672596"
  const oneCudo = "1000000000000000000"
  const fractionedOneCudo = "1.000000000000000000"
  const humanReadableOneCudo = "1"
  const smallRawNumber = "999999999999999999"
  const leadingZeroFractionedSmallNumber = "0.999999999999999999"
  const fractionNumber = "990099000.000364464707672596"
  const decimalSeparatedNumber = "990,099,000.000364464707672596"
  const largeCudosAmountWithTrailingZeroes = "990099000000364464700001000"
  const humanReabableLargeAmount = "990,099,000.000364464700001"
  const keplrReadyLargeAmount = "990099000.000364464700001000"
  
  it('rawNumber should change to fractionedNumber', () => {
    const result = separateFractions(rawNumber);
    expect(result).toEqual(fractionNumber);
    // 990099000000364464707672596 => 990099000.000364464707672596
  });

  it('fractionedNumber should change to decimalSeparatedNumber', () => {
    const result = separateDecimals(fractionNumber);
    expect(result).toEqual(decimalSeparatedNumber);
    // 990099000.000364464707672596 => 990,099,000.000364464707672596
  });

  it('rawNumber should change to fractioned decimalSeparatedNumber', () => {
    const result = separateDecimals(separateFractions(rawNumber));
    expect(result).toEqual(decimalSeparatedNumber);
    // 990099000000364464707672596 => 990,099,000.000364464707672596
  });

  it('1 CUDO should consists of 19 digits', () => {
    const result = oneCudo.length
    expect(result).toEqual(19);
    // oneCudo = 1000000000000000000
  });

  it('1 CUDO should be fractioned', () => {
    const result = separateFractions(oneCudo)
    expect(result).toEqual(fractionedOneCudo);
    // 1000000000000000000 => 1.000000000000000000
  });

  it('1 CUDO should be humanReadableOneCudo', () => {
    const result = cutTrailingZeroes(separateDecimals(separateFractions(oneCudo)))
    expect(result).toEqual(humanReadableOneCudo);
    // 1000000000000000000 => 1
  });

  it('small rawNumber < 1 CUDO should have lenght of 18 digits', () => {
    const result = smallRawNumber.length;
    expect(result).toEqual(18);
    // smallRawNumber = 999999999999999999
  });

  it('small rawNumber < 1 CUDO should change to fractioned number with leading 0', () => {
    const result = separateFractions(smallRawNumber);
    expect(result).toEqual(leadingZeroFractionedSmallNumber);
    // 999999999999999999 => 0.999999999999999999
  });

  it('large rawNumber > 990,099,000.00 CUDOS should change to humanReadable', () => {
    const result = cutTrailingZeroes(separateDecimals(separateFractions(largeCudosAmountWithTrailingZeroes)));
    expect(result).toEqual(humanReabableLargeAmount);
    // 990099000000364464700001000 => 990,099,000.000364464700001
  });

  it('large rawNumber should change to Keplr ready fractioned format', () => {
    const result = separateFractions(largeCudosAmountWithTrailingZeroes);
    expect(result).toEqual(keplrReadyLargeAmount);
    // 990099000000364464700001000 => 990099000.000364464700001
  });

});

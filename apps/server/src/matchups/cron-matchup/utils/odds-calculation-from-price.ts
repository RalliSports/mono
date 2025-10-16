export function calculateOddsFromPrice(price: number) {
    let americanOdds: number = 0;
    if (price < 2) {
        americanOdds = -(100 / (price - 1));
    } else {
        americanOdds = (price - 1) * 100;
    }
    return americanOdds;
}

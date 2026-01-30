import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export const getLivePrice = async (symbol: string): Promise<number> => {
    const quote = await yahooFinance.quote(symbol);

    if (
        !quote?.regularMarketPrice
    ) {
        throw new Error("Price not available");
    }

    return quote.regularMarketPrice;
};

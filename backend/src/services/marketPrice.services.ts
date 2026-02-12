import axios from "axios";

const priceCache = new Map<
  string,
  { price: number; previousClose: number | null; timestamp: number }
>();

const CACHE_TTL = 30 * 1000; 

const extractPriceData = (response: any) => {
  const meta = response?.data?.chart?.result?.[0]?.meta;
  return {
    price: meta?.regularMarketPrice ?? null,
    previousClose: meta?.previousClose ?? null
  };
};

export const getLivePriceData = async (symbol: string): Promise<{ price: number; previousClose: number | null }> => {
  const cacheKey = symbol.toUpperCase();
  const cached = priceCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { price: cached.price, previousClose: cached.previousClose };
  }

  try {
    const [nsRes, boRes] = await Promise.allSettled([
      axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.NS`),
      axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.BO`),
    ]);

    let data: { price: number | null; previousClose: number | null } = { price: null, previousClose: null };

    if (nsRes.status === "fulfilled") {
      data = extractPriceData(nsRes.value);
    }

    if (!data.price && boRes.status === "fulfilled") {
      data = extractPriceData(boRes.value);
    }

    if (data.price == null) {
      throw new Error("Price not found on NSE or BSE");
    }

    priceCache.set(cacheKey, {
      price: data.price,
      previousClose: data.previousClose,
      timestamp: Date.now(),
    });

    return { price: data.price, previousClose: data.previousClose };
  } catch (error) {
    if (cached) {
      return { price: cached.price, previousClose: cached.previousClose };
    }
    throw new Error("Invalid symbol");
  }
};


export const getLivePrice = async (symbol: string): Promise<number> => {
  const data = await getLivePriceData(symbol);
  return data.price;
};


export const searchSymbols = async (query: string) => {
  if (!query || query.length < 1) return [];

  const res = await axios.get(
    "https://query2.finance.yahoo.com/v1/finance/search",
    {
      params: {
        q: query,
        quotesCount: 8,
        newsCount: 0,
        enableFuzzyQuery: true,
        lang: "en-IN",
        region: "IN",
      },
      headers: {
        "User-Agent": "Morzilla/5.0",
      }
    }
  );
  return (
    res.data?.quotes
      ?.filter(
        (q: any) =>
          q.symbol &&
          q.shortname &&
          (q.exchDisp === "NSE" || q.exchDisp === "BSE")
      )
      .map((q: any) => ({
        symbol: q.symbol.replace(".NS", "").replace(".BO", ""),
        name: q.shortname,
      })) || []
  );
};



import axios from "axios";

const priceCache = new Map<
  string,
  { price: number; timestamp: number }
>();

const CACHE_TTL = 15 * 1000; // 15 seconds

const extractPrice = (response: any): number | null => {
  return (
    response?.data?.chart?.result?.[0]?.meta?.regularMarketPrice ??
    null
  );
};

export const getLivePrice = async (symbol: string): Promise<number> => {
  const cacheKey = symbol.toUpperCase();
  const cached = priceCache.get(cacheKey);

  //  Return cached price if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    //  Fetch NSE & BSE in parallel
    const [nsRes, boRes] = await Promise.allSettled([
      axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.NS`
      ),
      axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.BO`
      ),
    ]);

    let price: number | null = null;

    // 3️ Prefer NSE price
    if (nsRes.status === "fulfilled") {
      price = extractPrice(nsRes.value);
    }

    // 4️ Fallback to BSE
    if (!price && boRes.status === "fulfilled") {
      price = extractPrice(boRes.value);
    }

    if (price == null) {
    throw new Error("Price not found on NSE or BSE");
}


    //  Cache result
    priceCache.set(cacheKey, {
      price,
      timestamp: Date.now(),
    });

    return price;
  } catch (error) {
    //  Fallback to cache if API fails
    if (cached) {
      return cached.price;
    }

    throw new Error("Invalid symbol");
  }
};

export const searchSymbols = async (query: string) => {
  if (!query || query.length < 2) return [];

  const res = await axios.get(
    "https://query2.finance.yahoo.com/v1/finance/search",
    {
      params: {
        q: query,
        quotesCount: 10,
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
  console.log("🟡 Yahoo raw quotes:" , res.data?.quotes);
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



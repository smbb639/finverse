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

  // 1️⃣ Return cached price if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }

  try {
    // 2️⃣ Fetch NSE & BSE in parallel
    const [nsRes, boRes] = await Promise.allSettled([
      axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.NS`
      ),
      axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${cacheKey}.BO`
      ),
    ]);

    let price: number | null = null;

    // 3️⃣ Prefer NSE price
    if (nsRes.status === "fulfilled") {
      price = extractPrice(nsRes.value);
    }

    // 4️⃣ Fallback to BSE
    if (!price && boRes.status === "fulfilled") {
      price = extractPrice(boRes.value);
    }

    if (price == null) {
    throw new Error("Price not found on NSE or BSE");
}


    // 5️⃣ Cache result
    priceCache.set(cacheKey, {
      price,
      timestamp: Date.now(),
    });

    return price;
  } catch (error) {
    // 6️⃣ Fallback to cache if API fails
    if (cached) {
      return cached.price;
    }

    throw new Error("Invalid symbol");
  }
};

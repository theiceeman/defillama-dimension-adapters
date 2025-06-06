import fetchURL from "../../utils/fetchURL"
import { Chain } from "@defillama/sdk/build/general";
import { FetchResult, SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";


type ChainMap = {
  [chain: string | Chain]: string;
}
const historicalVolumeEndpoints: ChainMap = {
  [CHAIN.BSC]: "https://api.kiloex.io/common/queryTradeSummary",
  [CHAIN.OP_BNB]: "https://opapi.kiloex.io/common/queryTradeSummary",
  [CHAIN.MANTA]: "https://mantaapi.kiloex.io/common/queryTradeSummary",
  [CHAIN.TAIKO]: "https://taikoapi.kiloex.io/common/queryTradeSummary",
  [CHAIN.BSQUARED]: "https://b2api.kiloex.io/common/queryTradeSummary",
  [CHAIN.BASE]: "https://baseapi.kiloex.io/common/queryTradeSummary",
};

interface IVolume {
  time: number;
  dayTradeAmount:string;
  totalTradeAmount:string
}

const fetch = (chainId: string) => {
  return async (timestamp: number): Promise<FetchResult> => {
    const dayTimestamp = getUniqStartOfTodayTimestamp(new Date(timestamp * 1000))
    const historicalVolume: IVolume[] = (await fetchURL(historicalVolumeEndpoints[chainId]));

    const totalVolume = historicalVolume
      .find(item => item.time === dayTimestamp)?.totalTradeAmount

    const dailyVolume = historicalVolume
      .find(item => item.time === dayTimestamp)?.dayTradeAmount

    return {
      totalVolume: totalVolume,
      dailyVolume: dailyVolume,
      timestamp: dayTimestamp,
    };
  };
};


const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.BSC]: {
      fetch: fetch(CHAIN.BSC), start: 1686528000
    },
    [CHAIN.OP_BNB]: {
      fetch: fetch(CHAIN.OP_BNB), start: 1696636800
    },
    [CHAIN.MANTA]: {
      fetch: fetch(CHAIN.MANTA), start: 1698796800
    },
    [CHAIN.TAIKO]: {
      fetch: fetch(CHAIN.TAIKO), start: async () => 1717027200
    },
    [CHAIN.BSQUARED]: {
      fetch: fetch(CHAIN.BSQUARED), start: async () => 1722297600
    },
    [CHAIN.BASE]: {
      fetch: fetch(CHAIN.BASE), start: async () => 1728446497
    },
  },
};

export default adapter;

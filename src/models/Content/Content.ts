import { BuyCandle } from './BuyCandle/BuyCandle';
import { Information } from './Information/Information';
import { ShareCampaign } from './Share/ShareCampaign';
import { Map } from './Map/Map';
import { ExtraInformation } from './ExtraInformation/ExtraInformation';
import { Style } from './Style/Style';
import { Meta } from './Meta/Meta';

export interface Content {
  information: Information;
  shareCampaign: ShareCampaign;
  buyCandle: BuyCandle;
  map: Map;
  extraInformation: ExtraInformation[];
  extraPage: ExtraInformation[];
  style: Style;
  meta: Meta;

  headerImageURL: string;
  realCampaignSiteURL: string;
  candleImageURL: string;
  totalDonatedURL: string;
  countdownDate?: Date | string;
  hasEndDate: boolean;

  totalDonated?: number;
  totalDonations?: number;
  analyticsId?: string;
}

import { Translation } from '../Translation';
import { Price } from './Price';

export interface BuyCandle {
  title: Translation[];
  description: Translation[];
  currency: string;
  prices: Price[];
  emailRequired: boolean;
  fiscalCertificateEnabled: boolean;
  allowAnonymousDonations: boolean;
}

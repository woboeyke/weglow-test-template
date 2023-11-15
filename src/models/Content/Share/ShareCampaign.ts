import { Translation } from '../Translation';
import { ShareOption } from './ShareOption';

export interface ShareCampaign {
  shareOptions: ShareOption[];
  enableCopyLink: boolean;
  title: Translation[];
}

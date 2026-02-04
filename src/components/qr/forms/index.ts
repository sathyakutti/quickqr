export { UrlForm } from "./url-form";
export { TextForm } from "./text-form";
export { WifiForm } from "./wifi-form";
export { EmailForm } from "./email-form";
export { PhoneForm } from "./phone-form";
export { SmsForm } from "./sms-form";
export { VcardForm } from "./vcard-form";
export { MecardForm } from "./mecard-form";
export { SocialForm } from "./social-form";
export { UpiForm } from "./upi-form";
export { SepaForm } from "./sepa-form";
export { PixForm } from "./pix-form";
export { BitcoinForm } from "./bitcoin-form";
export { EthereumForm } from "./ethereum-form";
export { PaypalForm } from "./paypal-form";
export { EventForm } from "./event-form";
export { LocationForm } from "./location-form";
export { GoogleMapsForm } from "./google-maps-form";
export { AppStoreForm } from "./app-store-form";

import type { ComponentType } from "react";
import { UrlForm } from "./url-form";
import { TextForm } from "./text-form";
import { WifiForm } from "./wifi-form";
import { EmailForm } from "./email-form";
import { PhoneForm } from "./phone-form";
import { SmsForm } from "./sms-form";
import { VcardForm } from "./vcard-form";
import { MecardForm } from "./mecard-form";
import { SocialForm } from "./social-form";
import { UpiForm } from "./upi-form";
import { SepaForm } from "./sepa-form";
import { PixForm } from "./pix-form";
import { BitcoinForm } from "./bitcoin-form";
import { EthereumForm } from "./ethereum-form";
import { PaypalForm } from "./paypal-form";
import { EventForm } from "./event-form";
import { LocationForm } from "./location-form";
import { GoogleMapsForm } from "./google-maps-form";
import { AppStoreForm } from "./app-store-form";

export interface FormProps {
  onChange: (data: Record<string, string | boolean>) => void;
}

export const FORM_COMPONENTS: Record<string, ComponentType<FormProps>> = {
  url: UrlForm,
  text: TextForm,
  wifi: WifiForm,
  email: EmailForm,
  phone: PhoneForm,
  sms: SmsForm,
  vcard: VcardForm,
  mecard: MecardForm,
  social: SocialForm,
  upi: UpiForm,
  epc: SepaForm,
  pix: PixForm,
  bitcoin: BitcoinForm,
  ethereum: EthereumForm,
  paypal: PaypalForm,
  event: EventForm,
  geo: LocationForm,
  "google-maps": GoogleMapsForm,
  "app-store": AppStoreForm,
};

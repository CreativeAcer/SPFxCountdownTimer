import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICountdownTimerProps {
  description: string;
  title: string;
  endDate: Date;
  backgroundcolor: string;
  fontcolor: string;
  context: WebPartContext;
}

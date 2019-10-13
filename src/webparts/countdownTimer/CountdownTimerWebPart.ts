import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CountdownTimerWebPartStrings';
import CountdownTimer from './components/CountdownTimer';
import { ICountdownTimerProps } from './components/ICountdownTimerProps';

import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from "@pnp/spfx-property-controls/lib/PropertyFieldColorPicker";
import { PropertyFieldDateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";


export interface ICountdownTimerWebPartProps {
  description: string;
  title: string;
  isInitialized: boolean;
  recurrenceValue: number;
  delayValue: number;
  backgroundcolor: string;
  fontcolor: string;
  enddate: IDateTimeFieldValue;
}

export default class CountdownTimerWebPart extends BaseClientSideWebPart<ICountdownTimerWebPartProps> {
  private _resetd: Date;

  public render(): void {

    const element: React.ReactElement<ICountdownTimerProps > = React.createElement(
      CountdownTimer,
      {
        description: this.properties.description,
        title: this.properties.title,
        enddate: this.properties.enddate,
        resetdate: this._resetd,
        backgroundcolor: this.properties.backgroundcolor,
        fontcolor: this.properties.fontcolor,
        recurrenceValue: this.properties.recurrenceValue,
        delayValue: this.properties.delayValue,
        isInitialized: this.properties.isInitialized,
        context: this.context
      }
    );

    

    ReactDom.render(element, this.domElement);
  }
  

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected onInit(): Promise<void> {
    this.properties.isInitialized = false;
    // create a new promise
    return new Promise<void>((resolve, _reject) => {
        if (this.properties.backgroundcolor === undefined || this.properties.backgroundcolor === null) {
          this.properties.backgroundcolor = '#0090c5';
        }
        if (this.properties.fontcolor === undefined || this.properties.fontcolor === null) {
          this.properties.fontcolor = '#fff';
        }
        if (this.properties.enddate === undefined || this.properties.enddate === null) {
          console.warn('Property enddate is undefined');
          this.properties.enddate = {value: new Date(), displayValue: new Date().toDateString() };
        }else {
          this.properties.enddate = this.properties.enddate;
          this.properties.isInitialized = true;
          console.warn('property enddate has been set to previous value');
        }
        if (this.properties.recurrenceValue === undefined || this.properties.recurrenceValue === null) {
            this.properties.recurrenceValue = 0;
        }
        if (this.properties.delayValue === undefined || this.properties.delayValue === null) {
          this.properties.delayValue = 0;
        }
        // resolve the promise
        resolve(undefined);
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /*protected get disableReactivePropertyChanges(): boolean {
    return true;
  }*/

  
  protected onPropertyPaneFieldChanged(propPath: string, oldValue: any, newValue:any): void {
    this.properties[propPath] = newValue;
    if(propPath === 'enddate' && !this.properties.isInitialized) {
      this.properties.isInitialized = true;
      // this._resetd = this.calcReset(this._counter);
    } 
  }
  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          displayGroupsAsAccordion: true,
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Enter a title for the timer',
                  placeholder: 'Countdown',
                  maxLength: 50                
                }),
                PropertyFieldDateTimePicker('enddate', {
                  label: 'Select the enddate and time',
                  initialDate: this.properties.enddate,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours24,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'enddateId'
                })
              ]
            },
            {
              groupName: strings.RepeatGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyFieldNumber("recurrenceValue", {
                  key: "recurrenceValueId",
                  label: "Repeat every",
                  description: "Amount of days to add each cycle",
                  value: this.properties.recurrenceValue,
                  maxValue: 365,
                  minValue: 0,
                  disabled: false
                }),
                PropertyFieldNumber("delayValue", {
                  key: "delayValueId",
                  label: "Delay reset for",
                  description: "Amount of hours to wait before resetting counter",
                  value: this.properties.delayValue,
                  maxValue: 48,
                  minValue: 0,
                  disabled: false
                })
              ]
            },
            {
              groupName: strings.ColorGroupName,
              isCollapsed: true,
              groupFields: [
                PropertyFieldColorPicker("fontcolor", {
                  label: "Font Color",
                  selectedColor: this.properties.fontcolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: "Precipitation",
                  key: "fontcolorId"
                }),
                PropertyFieldColorPicker("backgroundcolor", {
                  label: "Background Color",
                  selectedColor: this.properties.backgroundcolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: "Precipitation",
                  key: "backgroundcolorId"
                })
              ]
            }
          ]
        },
      ]
    };
  }
}

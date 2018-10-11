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

import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";


export interface ICountdownTimerWebPartProps {
  description: string;
  title: string;
}

export default class CountdownTimerWebPart extends BaseClientSideWebPart<ICountdownTimerWebPartProps> {
  protected _backgroundcolor = '#0090c5';
  protected _fontcolor = '#fff';
  protected _endDate: IDateTimeFieldValue = {value: new Date(), displayValue: new Date().toDateString() };

  public render(): void {
    const element: React.ReactElement<ICountdownTimerProps > = React.createElement(
      CountdownTimer,
      {
        description: this.properties.description,
        title: this.properties.title,
        endDate: this._endDate,
        backgroundcolor: this._backgroundcolor,
        fontcolor: this._fontcolor,
        context: this.context
      }
    );

    

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /*protected get disableReactivePropertyChanges(): boolean {
    return true;
  }*/

  
  protected onPropertyPaneFieldChanged(propPath: string, oldValue: any, newValue:any): void {
    switch (propPath) {
      case 'font color':
        this._fontcolor = newValue;
        break;
      case 'background color':
        this._backgroundcolor = newValue;
        break;
      case 'end date':
        this._endDate = newValue.value;
        break;
      default:
        break;
    }
    
  }
  

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
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
                PropertyFieldDateTimePicker('end date', {
                  label: 'Select the enddate and time',
                  initialDate: this._endDate,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours24,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'dateTimeFieldId'
                })
              ]
            }
          ]
        },
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.ColorGroupName,
              groupFields: [
                PropertyFieldColorPicker("font color", {
                  label: "Font Color",
                  selectedColor: this._fontcolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: "Precipitation",
                  key: "colorFieldId"
                }),
                PropertyFieldColorPicker("background color", {
                  label: "Background Color",
                  selectedColor: this._backgroundcolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  disabled: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Full,
                  iconName: "Precipitation",
                  key: "colorFieldId"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

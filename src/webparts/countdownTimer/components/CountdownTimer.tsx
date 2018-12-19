import * as React from 'react';
import styles from './CountdownTimer.module.scss';
import { ICountdownTimerProps } from './ICountdownTimerProps';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import  Timedisplay  from './timesdisplay/Timedisplay';


export interface ICountdownTimerState {
  daysSpan : number;
  hoursSpan : number;
  minutesSpan : number;
  secondsSpan : number;
  showPlaceholder: Boolean;
}

export default class CountdownTimer extends React.Component<ICountdownTimerProps, ICountdownTimerState> {
  private timeinterval: any;

  constructor(props: any){
    super(props);

    this.state = {
      daysSpan : 0,
      hoursSpan : 0,
      minutesSpan : 0,
      secondsSpan : 0,
      showPlaceholder: true
    };
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.endDate !== prevProps.endDate) {
      if (this.props.endDate !== null) {
        // hide config warning
        this.setState({
          showPlaceholder: false
        });
        // First reset interval then start with new date
        clearInterval(this.timeinterval);
        this.initializeClock(this.props.endDate);
      } else {
        this.setState({
          showPlaceholder: true
        });
      }
    }
}

  /*public componentDidMount() {
    if(this.props.endDate)
      this.initializeClock(this.props.endDate.value);
  }*/

  public componentWillUnmount() {
      clearInterval(this.timeinterval);
  }

  private _configureWebPart = () => {
    this.props.context.propertyPane.open();
  }
  

  public render(): React.ReactElement<ICountdownTimerProps> {
    if (this.state.showPlaceholder) {
      return (
        <Placeholder
          iconName="Edit"
          iconText="List view web part configuration"
          description="Please configure the web part before you can show the list view."
          buttonLabel="Configure"
          onConfigure={this._configureWebPart} />
      );
    }
    return (
      <div className={styles.countdownTimer}>
        <h1 style={{color: this.props.backgroundcolor}} className={styles.h1clock}>{this.props.title}</h1>
        <div style={{color: this.props.fontcolor}} className={styles.clockdiv} ref="clock">
          <Timedisplay  backgroundcolor={this.props.backgroundcolor} time={this.state.daysSpan} name="Days"></Timedisplay>
          <Timedisplay  backgroundcolor={this.props.backgroundcolor} time={this.state.hoursSpan} name="Hours"></Timedisplay>
          <Timedisplay  backgroundcolor={this.props.backgroundcolor} time={this.state.minutesSpan} name="Minutes"></Timedisplay>
          <Timedisplay  backgroundcolor={this.props.backgroundcolor} time={this.state.secondsSpan} name="Seconds"></Timedisplay>
        </div>
    </div>
    );
  }

  private initializeClock(endtime) {  
    const _self = this;
    function getTimeRemaining(_endtime) {
      var t = Date.parse(_endtime) - Date.parse(String(new Date()));
      var seconds = Math.floor((t / 1000) % 60);
      var minutes = Math.floor((t / 1000 / 60) % 60);
      var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      var days = Math.floor(t / (1000 * 60 * 60 * 24));
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }


    function updateClock() {
      var t = getTimeRemaining(endtime);
      _self.setState({
        daysSpan : Number(t.days),
        hoursSpan : Number(('0' + t.hours).slice(-2)),
        minutesSpan : Number(('0' + t.minutes).slice(-2)),
        secondsSpan : Number(('0' + t.seconds).slice(-2))
      });
  
      if (t.total <= 0) {
        _self.setState({
          daysSpan : 0,
          hoursSpan : 0,
          minutesSpan : 0,
          secondsSpan : 0
        });
        clearInterval(this.timeinterval);
      }
    }
  
    updateClock();
    this.timeinterval = setInterval(updateClock, 1000);
  }

}

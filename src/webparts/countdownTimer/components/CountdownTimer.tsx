import * as React from 'react';
import styles from './CountdownTimer.module.scss';
import { ICountdownTimerProps } from './ICountdownTimerProps';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import  Timedisplay  from './timesdisplay/Timedisplay';
import * as dayjs from 'dayjs';


export interface ICountdownTimerState {
  daysSpan : number;
  hoursSpan : number;
  minutesSpan : number;
  secondsSpan : number;
  resetDate: Date;
  showPlaceholder: Boolean;
}

export default class CountdownTimer extends React.Component<ICountdownTimerProps, ICountdownTimerState> {
  private timeinterval: any;
  private resetinterval: any;

  constructor(props: any){
    super(props);


    this.state = {
      daysSpan : 0,
      hoursSpan : 0,
      minutesSpan : 0,
      secondsSpan : 0,
      resetDate: null,
      showPlaceholder: false
    };

  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (this.props.enddate !== prevProps.enddate) {
      if (this.props.enddate !== null) {
        // hide config warning
        this.setState({
          showPlaceholder: false
        });
        // First reset interval then start with new date
        clearInterval(this.timeinterval);
        // Calc new reset date when date is changed
        this.setState({
          resetDate: this.props.enddate.value
        });
        this.initializeClock(this.props.enddate.value);
      } else {
        this.setState({
          showPlaceholder: true
        });
      }
    }
    
}

  public componentDidMount() {
    // retain set date when refreshing or navigating
    clearInterval(this.timeinterval);
    this.setState({
      showPlaceholder: false,
      resetDate: this.props.enddate.value
    });
    this.initializeClock(this.props.enddate.value);
  }

  public componentWillUnmount() {
      clearInterval(this.timeinterval);
      clearInterval(this.resetinterval);
  }

  private _configureWebPart = () => {
    this.props.context.propertyPane.open();
  }
  

  public render(): React.ReactElement<ICountdownTimerProps> {
    if (this.state.showPlaceholder) {
      return (
        <Placeholder
          iconName="Edit"
          iconText="Countdown Timer web part configuration"
          description="Please configure the web part before you can show the Countdown Timer."
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
        clearInterval(_self.timeinterval);
        clearInterval(_self.resetinterval);
        if(_self.props.recurrenceValue > 0) {
          _self.setNewDates();
        }
      }
    }
  
    updateClock();
    this.timeinterval = setInterval(updateClock, 1000);
  }

  private setNewDates(){
    const _self = this;

    function waitForReset(){
// hour
      if(dayjs().isAfter(dayjs(_self.state.resetDate).add(_self.props.delayValue, 'hour'), 'second')) {
        //day
        _self.setState({
          resetDate : dayjs(_self.state.resetDate).add(_self.props.recurrenceValue, 'day').add(_self.props.delayValue, 'hour').toDate()
        });
        // Run timer again with new date
        _self.initializeClock(_self.state.resetDate);
      }
    }

    // Update dates with new recurrence
    waitForReset();
    this.resetinterval = setInterval(waitForReset, 1000);
    
    
  }

}

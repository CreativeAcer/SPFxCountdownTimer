import * as React from 'react';
import styles from '../CountdownTimer.module.scss';

export interface ITimedisplayProps {
    backgroundcolor: string;
    time: number;
    name: string;
  }

export default class Timedisplay extends React.Component<ITimedisplayProps,{}> {
    constructor(props: any){
        super(props);  
      }

      public render(): React.ReactElement<ITimedisplayProps> {
        return (
            <div style={{backgroundColor: this.props.backgroundcolor}} className={styles.timetext}>
                <span className={styles.timetitle}>{this.props.time}</span>
                <div className={styles.smalltext}>{this.props.name}</div>
            </div>
        );
      }

}
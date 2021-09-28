import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import { Session } from '../services/session';
import {environment} from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import {HttpTransportType} from '@microsoft/signalr';
import {EventDispatcher} from "strongly-typed-events";
import {afterlogServices} from "./afterlog.services";

@Injectable({
  providedIn: 'root'
})



export class SignalService {
  private connection!: signalR.HubConnection;
  OneMinuteReconnectPolicy: any;
  reconnectPolicy:any ;
  private JWT : string
  public Id: string

  private _onConnect = new EventDispatcher<string, number>();
  private SignalHash : string
  private _onUserConnect = new EventDispatcher<string, number>();
  testName: null
  constructor(private http: HttpClient, private afteraut: afterlogServices ) {



    this.OneMinuteReconnectPolicy = (function () {

      function OneMinuteReconnectPolicy() { }

      OneMinuteReconnectPolicy.prototype.nextRetryDelayInMilliseconds = function (retryContext: { elapsedMilliseconds: number; }) {
        return retryContext.elapsedMilliseconds < 60000 ? 3000 : null;
      };

      return OneMinuteReconnectPolicy;

    });

    this.reconnectPolicy  = new this.OneMinuteReconnectPolicy();
  }


  connect(){
    //console.log(cl)
    this.Id = localStorage.getItem('Id');
    this.JWT = localStorage.getItem('aut-token');
    var options = {
      transport: signalR.HttpTransportType.WebSockets,
      logging: signalR.LogLevel.Trace,
      accessToken: this.JWT
    };
    console.log(this.JWT)
    console.log(localStorage.getItem('Id'))
    console.log(this.Id)
    this.connection = new signalR.HubConnectionBuilder()//?user=${this.Id}
      .withUrl( `${environment.apiUrl}/chat?access_token=${this.JWT}&userid=${this.Id}`, { accessTokenFactory: () => this.JWT
      , transport: HttpTransportType.LongPolling | HttpTransportType.WebSockets
      }

      ).withAutomaticReconnect(this.reconnectPolicy).build();
    //console.log(this.connection);
    this.connection.serverTimeoutInMilliseconds = 120 * 1000;

    this.connection.onreconnected(()=>{
      this.SignalHash = this.connection.connectionId ? this.connection.connectionId :"";
      console.log("reconnected " + this.SignalHash);
      this._onConnect.dispatch(this.SignalHash, 0);

    });

    this.connection
      .start()
      .then(() => { console.log('Connection started')
          this.SignalHash = this.connection.connectionId ? this.connection.connectionId :"";
          console.log(this.SignalHash);
          this._onConnect.dispatch(this.SignalHash, 0);
         // this.addTransferChartDataListener();

        // this.afteraut.afterLog(this.testName).subscribe(
        //   ()=> console.log("afterlog working!"),
        //   error => {
        //     console.log("afterlog dont work")
        //   }
        // )
        }
      )
      .catch(err => console.log('Error while starting connection: ' + err))
    return true;
    //this.connection.serverTimeoutInMilliseconds = 1000 * 60 * 10;
  }

  public get onConnect() {
    return this._onConnect.asEvent();
  }
  public get onUserConnect() {
    return this._onUserConnect.asEvent();
  }

  public disconnect(){
    this.connection.stop();
  }
  public onHash(){
    return this.SignalHash;
  }


  public addTransferChartDataListener = () => {
    this.connection.on('System', (data) => {
      if (data == "Подключен к серверу")
      {


      }
      console.log(data);
    });

    this.connection.on('Keep-Alive',  () => {
       console.log('Keep-Alive');
       this.connection.invoke('ResponseKeepAlive');


    });

    this.connection.on('Debug',  (title:string, dis: string) => {
      console.log('Debug ' + title + " " + dis);

    });
    this.connection.onclose =() =>{



    }



  }



}

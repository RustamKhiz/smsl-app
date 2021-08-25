import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { Session } from '../services/session';

import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { User } from '../services/interfaces';
import { AutServices } from '../services/aut.services';
import { SignalDispatcher, SimpleEventDispatcher, EventDispatcher } from "strongly-typed-events";
@Injectable({
  providedIn: 'root'
})



export class SignalService {
  private connection!: signalR.HubConnection;
  OneMinuteReconnectPolicy: any;
  reconnectPolicy:any ;
  private Id : string
  private JWT : string

  private _onConnect = new EventDispatcher<string, number>();
  private SignalHash : string
  private _onUserConnect = new EventDispatcher<string, number>();

  constructor(private http: HttpClient ) {
    this.Id = localStorage.getItem('Id');


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
    this.JWT = localStorage.getItem('aut-token');
    var options = {
      transport: signalR.HttpTransportType.WebSockets,
      logging: signalR.LogLevel.Trace,
      accessToken: this.JWT
    };
    console.log(this.JWT)
    this.connection = new signalR.HubConnectionBuilder()//?user=${this.Id}
      .withUrl( `${environment.apiUrl}/chat?access_token=${this.JWT}`, { accessTokenFactory: () => this.JWT}

      ).withAutomaticReconnect(this.reconnectPolicy).build();
    //console.log(this.connection);
    this.connection.serverTimeoutInMilliseconds = 120 * 1000;



    this.connection
      .start()
      .then(() => { console.log('Connection started')
          this.SignalHash = this.connection.connectionId ? this.connection.connectionId :"";
          console.log(this.SignalHash);
          this._onConnect.dispatch(this.SignalHash, 0);
          this.addTransferChartDataListener();

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



  public addTransferChartDataListener = () => {
    this.connection.on('System', (data) => {
      if (data == "Подключен к серверу")
      {


      }
      console.log(data);
    });
    this.connection.on('MessagePage',  (action,userId, hash) => { //"MessagePage", "connect", cl.UserId, cl.ConnectionHash
      // console.log(action);
      this._onUserConnect.dispatch(action, userId);
    });
    this.connection.onclose =() =>{



    }



  }



}

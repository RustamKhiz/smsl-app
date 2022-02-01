import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import { Session } from '../services/session';
import {environment} from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import {HttpTransportType} from '@microsoft/signalr';
import {EventDispatcher} from "strongly-typed-events";
import {afterlogServices} from "./afterlog.services";
import { AutServices } from './aut.services';
import { SiteLayoutComponent } from '../site-layout/site-layout.component';
import { Router } from '@angular/router';
import { TokenInterseptor } from '../classes/token.interseptor';
import { NewAlertComponent } from '../classes/new-alert/new-alert.component';

@Injectable({
  providedIn: 'root'
})



export class SignalService {
  public connection!: signalR.HubConnection;
  OneMinuteReconnectPolicy: any;
  reconnectPolicy:any ;
  private JWT : string
  public Id: string

  private _onConnect = new EventDispatcher<string, number>();
  private SignalHash : string = ""
  private _onUserConnect = new EventDispatcher<string, number>();
  testName: null
  constructor(  private http: HttpClient, private afteraut: afterlogServices, private router: Router) {



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
    // console.log(this.JWT)
    // console.log(localStorage.getItem('Id'))
    // console.log(this.Id)
    this.connection = new signalR.HubConnectionBuilder()//?user=${this.Id}
      .withUrl( `${environment.apiUrl}/chat?access_token=${this.JWT}&userid=${this.Id}`, { accessTokenFactory: () => this.JWT
      , transport: HttpTransportType.LongPolling
      }

      ).withAutomaticReconnect(this.reconnectPolicy).build();
    //console.log(this.connection);
    this.connection.serverTimeoutInMilliseconds = 120 * 1000;

    this.connection.onreconnected(()=>{
      this.SignalHash = this.connection.connectionId ? this.connection.connectionId :"";
      // console.log("reconnected " + this.SignalHash);

      this._onConnect.dispatch(this.SignalHash, 0);

    });

    this.connection
      .start()
      .then(() => {
        console.log('Connection started')
          this.SignalHash = this.connection.connectionId ? this.connection.connectionId :"";
          // console.log(this.SignalHash);
          this._onConnect.dispatch(this.SignalHash, 0);
          this.addTransferChartDataListener();

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

    this.connection.on('KeepAlive',  () => {
      console.log('Keep-Alive');

      let dontActiveTime = JSON.parse(localStorage.getItem('DontActiveTime'))
      if (dontActiveTime == null){
        dontActiveTime = 0
      }

      this.connection.invoke('ResponseKeepAlive', {"DontActiveTime":dontActiveTime,'Brauser':''});

    }
    );

    this.connection.on('Debug',  (title:string, dis: string) => {
      // console.log('Debug ' + title + " " + dis);

    });

    this.connection.on('TokenAction', (tokenAction) => {
      console.log("TokenAction", tokenAction)
      this.disconnect()
      localStorage.clear()
      this.router.navigate(['/aut'])
      // this.aut.logout()
    })

    // this.connection.on('CwrAlert', (NewReport) => {
    //   console.log("CwrAlert", NewReport)
    //   if (NewReport.action == "NewReport"){
    //     let title = "Новый отчет!"
    //     let number = NewReport.id
    //     let subTitle = JSON.parse(localStorage.getItem('Locations')).find(x => x.Id == NewReport.subLocationId).Name
    //     let desc = JSON.parse(localStorage.getItem('Personal')).find(x => x.Id == NewReport.userId).SmalFio
    //     let alertObj = {title: title, number: number, subTitle: subTitle, desc: desc, logo: ""}
    //     localStorage.setItem('alert',  JSON.stringify(alertObj))
    //     // this.alert.addToAlert(title, number, subTitle, desc)
    //   }

    // })

    this.connection.on('RewriteToken',  (Token:string) => {
      localStorage.setItem('aut-token', Token)

      this.Id = localStorage.getItem('Id');
      //this.connection.baseUrl = `${environment.apiUrl}/chat?access_token=${Token}&userid=${this.Id}`;

      this.connect();


      console.log('RewriteToken: ', Token);

    });
    this.connection.onclose = (error) => {
      console.log(error)
    }
    this.connection.onclose =() =>{

    }
  }



}

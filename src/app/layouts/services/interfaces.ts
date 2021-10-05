export interface User {
  UserName: string
  Password: string
  ConnectionHash: string
  MyPerson: {
    Personal:{
      Name: string
      LastName: string
      MidName: string
      Telephone: string
      Position: string
      Id: string
    }
  }
}

export interface Personals{
  Id: string
  Fio: string
  Bithday: string
  Gender: string
  Adress: string
  Telephone: string
  EMail: string
  DefId: string
  Organization: string
  Position: string
  Location: string
  StatusWork: string
  Inn: string
  Snils: string
  GenPass: string
  Name: string
  LastName: string
  MidName: string
  IsOnline: boolean
}
export interface Mashines{
  Наименование: string
  ДатаПроизводства: string
  Name: string
  Status: string
  Location: string
  PeronalFio: string
  Группа: string
  Comments: string
  ПолноеНаименование: string
  Производитель: string
  СтранаПроизводства: string
}
export interface NameComplWorks{
  Method: string
  Customer: string
  Staff: {Id: any, Fio: string}
  Equipment: string
  Shown: string
  Made: string
  Comment: string
}
export interface Report {
  DataReport: string,
  Comment?: string,
  GeneralLocation: {
      DisplayName: string
  },
  CwrWorks:
      {
          MethodControl: string
          Customer: {
              NameRu: string
          }
          Shown: number
          Made: number
          Comment?: string
          CwrWorkPersonals:
              {
                  Personal: {
                      Id: number
                      Fio: string
                  }
              }
          CwrWorkEquipments:
                {
                  Equipment: {
                      Id: number
                      Name: string
                      }
                }
      },
  CwrPersonals:
      {
          Comment?: string
          Personal: {
              Id: number
              Fio: string
          },
          CwrStatusFromPersonals:
              {
                  CwrPesonalStatus: {
                      DisplayName: string
                      Description?: string
                      IsWork?: boolean
                  }
              }
      },
  CwrEquipments:
      {
          Status: string
          Equipment: {
              Id: number
              Name: string
          }
      },
  CwrActions?: [],
  CwrFiles?: [],

}

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
export interface Report{
  Id: number
  DataCreate: string
  UserId: number
  СhiefUserId: number
  GeneralLocationId: number
  SubLocationId: number
  DataReport: string
  Comment: string
  IsActual: boolean
  GeneralLocation: {
      Id: number
      DisplayName: string
  }
  CwrWorks: [
      {
          Id: number
          MethodControl: string
          CustomerId: number
          Customer: {
              Id: number
              NameRu: string
              NameEn: string
              Inn: number
              MapOffice: string
          }
          Shown: number
          Made: number                                                                                                                                                                                                                                                         
          Comment: string
          CwrId: string
          CwrWorkPersonals: [
              {
                  Id: number
                  PersonalId: number
                  CwrWorkId: number
                  Personal: {
                      Id: number
                      Fio: string
                  }
              }
          ]
          CwrWorkEquipments: [
              {
                  Id: number
                  EquipmentId: number
                  CwrWorkId: number
                  Equipment: {
                      Id: number
                      Name: string
                      }
                }
          ]
      }
  ],
  CwrPersonals: [
      {
          Id: number
          PersonalId: number
          Comment: string
          CwrId: number
          Personal: {
              Id: number
              Fio: string
          },
          CwrStatusFromPersonals: [
              {
                  Id: number
                  CwrStatusId: number
                  CwrPesonalStatus: {
                      Id: number
                      DisplayName: string
                      Description: string
                      IsWork: boolean
                  },
                  CwrPersonalId: number
              }
          ]
      }
  ],
  CwrEquipments: [
      {
          Id: number
          EquipmentId: number
          Status: string
          Equipment: {
              Id: number
              Name: string
          },
          CwrId: number
      }
  ],
  CwrActions: [],
  CwrFiles: []
}

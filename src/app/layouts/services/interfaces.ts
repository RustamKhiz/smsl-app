import { PersonalComponent } from "../site-layout/personal/personal.component";

export interface User {
  UserName: string
  Password: string
  ConnectionHash?: string
  MyPerson?: {
    Personal:{
      AccessLevel: string
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
  Personals: [{
    Id: number,
    Fio: string,
    SmalFio: string,
    Bithday: string,
    Gender: string,
    Adress: string,
    Telephone: string,
    EMail: string,
    DefId: string,
    Organization: string,
    Position: string,
    Location: string,
    StatusWork: string,
    Inn: string,
    Snils: string,
    GenPass: string,
    Name: string,
    LastName: string,
    MidName: string,
    IsOnline: boolean
  }]

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

export interface Locations{
  Locations: [{
    Actual: number,
    DataBaseName: string,
    Description: string,
    GeneralLocationId: number,
    HashId: string,
    Id: number,
    Name: string,
    SmallName: string,
    WeatherId: string,
    WeatherName: string
  }]
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
  Id: 0,
  UserId: number,
  СhiefUserId: number,
  GeneralLocationId: number,
  SubLocationId: number,
  DataReport: string,
  Comment: string,
  IsActual: boolean,
  GeneralLocation: string,
  CwrWorks: {
      Id: number,
      MethodControl: string,
      CustomerId: number,
      Customer: {NameRu: string},
      Shown: number,
      Made: number,
      Comment: string,
      CwrId: number,
      CwrWorkPersonals: {
              Id: number,
              PersonalId: number,
              CwrWorkId: number,
              Personal: {Id: number, Fio: string}
          },
      CwrWorkEquipments: {
              Id: number,
              EquipmentId: number,
              CwrWorkId: number,
              Equipment: {Id: number, Name: string}
          }
  },
  CwrPersonals: {
          Id: number,
          PersonalId: number,
          Comment: string,
          CwrId: number,
          Personal: {Id: number, Fio: string},
          CwrStatusFromPersonals: {
                  Id: number,
                  CwrStatusId: number,
                  CwrPesonalStatus: string,
                  CwrPersonalId: number
              }
      }
  CwrEquipments: {
          // Id: number,
          EquipmentId: number,
          // Status: string,
          // Equipment: string,
          // CwrId: number
      },
  CwrActions: null,
  CwrFiles: null
}
export interface CwrWorks{
  MethodControl: string,
  Customer: {NameRu: string},
  CwrWorkPersonals:{Personal: {Id: number, Fio: string}},
  CwrWorkEquipments:{Equipment: {Id: number, Name: string}},
  Shown: number,
  Made: number,
}
export interface Filter{
  ReportId: number,
  FromDate?: string,
  ToDate?: string,
  ChiefIds: number[],
  GeneralLocIds: number[],
  SubLocIds: number
}
export interface ReportsAll{
  Id: number,
  DataCreate: string,
  UserId: number,
  СhiefUserId: number,
  GeneralLocationId: number,
  SubLocationId: number,
  DataReport: string,
  Comment: string,
  IsActual?: boolean,
  GeneralLocation: {
    Id: number,
    DisplayName: string,
    Logo: string
  },
  CwrWorks: [{
    Id: number,
    MethodControl: string,
    CustomerId: number,
    Customer: {
      id: number,
      NameRu: string,
      NameEn: string,
      Inn: number,
      MapOffice: string
    },
    Shown: string,
    Made: string,
    Comment: string,
    CwrId: number,
    CwrWorkPersonals: [{
      Id: number,
      PersonalId: number,
      CwrWorkId: number,
      Personal: {
        Id: number,
        Fio: string,
        Bithday: string,
        Gender: string,
        Adress: string,
        Telephone: string,
        EMail: string,
        DefId: string,
        Organization: string,
        Position: string,
        Location: string,
        StatusWork: string,
        Name: string,
        LastName: string,
        MidName: string,
        SmalFio: string
      }
    }],
    CwrWorkEquipments:[{
      Id: number,
      EquipmentId: number,
      CwrWorkId: number,
      Equipment:{
        Id: number,
        MetodNk: string,
        Name: string,
        FullName: string,
        Number: number,
        DataCheck: string,
        CertName: string,
        Sezlab: string,
        Status: string,
        Location: string,
        PeronalFio: string,
        DataProduction: string,
        Group: string,
        Comments: string,
        LocationMvz: string,
        LargeName: string,
        ProductionCompany: string,
        LandCreate: string
      }
    }]
  }],
  CwrPersonals:[{
    Id: number,
    PersonalId: number,
    Comment: string,
    CwrId: number,
    Personal:{
      Id: number,
      Fio: string,
      Bithday: string,
      Gender: string,
      Adress: string,
      Telephone: string,
      EMail: string,
      DefId: string,
      Organization: string,
      Position: string,
      Location: string,
      StatusWork: string,
      Name: string,
      LastName: string,
      MidName: string,
      SmalFio: string
    },
    CwrStatusFromPersonals:[{
      Id: number,
        CwrStatusId: number,
        CwrPesonalStatus: {
          Id: number,
          DisplayName: string,
          Description: string,
          IsWork: boolean
        },
        CwrPersonalId: number
    }],
    ForTabPerStatusId: number
  }],
  CwrEquipments:[{
    Id: number,
    EquipmentId: number,
    Status: string,
    Equipment: {
      Id: number,
      MetodNk: string,
      Name: string,
      FullName: string,
      Number: number,
      DataCheck: string,
      CertName: string,
      Sezlab: string,
      Status: string,
      Location: string,
      PeronalFio: string,
      DataProduction: string,
      Group: string,
      Comments: string,
      LocationMvz: string,
      LargeName: string,
      ProductionCompany: string,
      LandCreate: string
    },
    CwrId: number
  }],
  CwrActions: [],
  CwrFiles: [
    {
      CwrId: string,
      DisplayName: string,
      Ext: string,
      FileType: string,
      FullPath: string,
      Hash: string,
      Id: number,
      IsPreveiw: boolean,
      Length: number,
      OriginalName: string
    }
  ]
}
export interface DropDownMultiItem{
  Id: number,
  Fio: string,
  IsChecked: boolean,
  SmallName: string,
  NameRu: string,
  Name: string,
  FullName: string,
  Number: string,
  DisplayName: string
}

export interface Dropdown {
  Id: number;
  Name?: string;
  NameRu?: string;
  SmallName?: string,
  Fio?: string,
  FullName?: string,
  Number?: string,
  // test: any
}
export interface NewDropdown{
  Id: number,
  Name: string,
  Display: boolean,
  IsSelect: boolean
  }
export interface NearbyReport{
  ChiefWorkReport?: any,
  Next: {
    Id: number,
    СhiefUserId: number,
    GeneralLocationId: number,
    SubLocationId: number,
    DataReport: string
  },
  Prev: {
    Id: number,
    СhiefUserId: number,
    GeneralLocationId: number,
    SubLocationId: number,
    DataReport: string
  },
  IsNext: boolean,
  IsPrev: boolean
}
export interface Alert{
  title: string,
  number: number,
  subTitle: string,
  desc: string,
  logo: string
}
export interface Config {
  Id: number,
  GroupName: string,
  Name: string,
  Value: string,
  UserId: string
}
`public partial class AngularUserProp
{

    public int Id { get; set; }
    public string GroupName { get; set; }
    public string Name { get; set; }
    public string Value { get; set; }
    public int UserId { get; set; }

}`

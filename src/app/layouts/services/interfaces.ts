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
export interface Staff{

}

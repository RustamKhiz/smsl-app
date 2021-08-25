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

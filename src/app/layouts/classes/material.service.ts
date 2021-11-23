declare var M;
declare var D;
declare var S;

export class MaterialService {
    static toast(message: string){
        M.toast({html: message})
    }
}
export class OpenSnack {
   openSnackBar(message: string, action: string) {
    S.open(message, action, {
      duration: 3000
    });
    console.log("проверка ошибки")
  }
}

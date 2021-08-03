declare var M;
declare var D;

export class MaterialService {
    static toast(message: string){
        M.toast({html: message})
    }
    static dropdown(){
        D.dropdown()
    }
}

import HttpService from "./httpservice";

let _singleton: boolean = true;
let _instance: PaymentService;
class PaymentService {
    
    SUCCESS = "payment/success";
    

    constructor(){
        if(_singleton){
            throw new SyntaxError('This is a singleton class. Please use PaymentService.instance instead!');
        }        
    }

    static get instance(): PaymentService{
        if (!_instance) {
            _singleton = false;
            _instance = new PaymentService();
            _singleton = true;
        }
        return _instance;
    }

    async paymentSuccess(data){
        return await HttpService.instance.post(this.SUCCESS, data);
    }
    
}
export default PaymentService;
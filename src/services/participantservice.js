import HttpService from "./httpservice";

let _singleton: boolean = true;
let _instance: ParticipantService;
class ParticipantService {
    
    CREATE = "team/student/create";
    DELETE = "team/student";
    CREATE_TEAM = "team/create";
    GET_COMPETITIONS = "competitions/get"

    constructor(){
        if(_singleton){
            throw new SyntaxError('This is a singleton class. Please use ParticipantService.instance instead!');
        }        
    }

    static get instance(): ParticipantService{
        if (!_instance) {
            _singleton = false;
            _instance = new ParticipantService();
            _singleton = true;
        }
        return _instance;
    }

    async create(participant){
        return await HttpService.instance.post(this.CREATE, participant);
    }
    async delete(participant){
        return await HttpService.instance.delete(this.DELETE, participant);
    }
    async createTeam(team) {
        return await HttpService.instance.post(this.CREATE_TEAM, team);
    }
    async getCompetitions(){
         return await HttpService.instance.get(this.GET_COMPETITIONS);
    }
}
export default ParticipantService;
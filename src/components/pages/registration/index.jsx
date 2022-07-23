// @flow
import React, {Component} from "react";
import DatePicker from "react-datepicker"; 
import topImage from '../../../assets/images/home/top_image.png';
import botomImage from '../../../assets/images/home/bottom_image.png';
import Header from '../../library/header';
import Footer from  "../../library/footer";
import FormHeader from "../../library/form_header";
import DropdownMenu from "../../library/dropdown";
import AddButton from "../../library/addbutton";
import TextArea from "../../library/textarea";
import InputText from "../../library/inputtext";
import Button from "../../library/button";
import AddParticipantForm from "../../forms/addparticipant";
import IndividualForm from "../individual";
import TeamForm from "../team";
// Images

// Style sheet
import './style.scss';
import "react-datepicker/dist/react-datepicker.css";
import Utils from "../../../utils/utilityScript";
/*import Team from "../../../models/team";
import ParticipantAvatar from "../../library/participant_avatar";
import VideoUploader from "../../library/videouploader";
import Utils from "../../../utils/utilityScript";
import TeamService from "../../../services/teamservice";
import HttpService from "../../../services/httpservice";
import ParticipantService from "../../../services/participantservice";
import AccompaniesService from "../../../services/accompaniesservice";
import Result from "../../library/result_popup";*/

type Props = {};

let _objForm = null;
class International  extends Component<Props> {
	formSubTitle= "REGISTRATION FORM";
	countryList 
	genders= ["Select", "Male", "Female", "Others"];
	// age_group =[{id:1,label:'5-10'},{id:2,label:'11-15'}]


	constructor(props: Object) {
		super(props);
		this.state = { 
			 registration_type:'individual'
		}
	 
		//_objForm = new Team();
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this.studentCreated = this.studentCreated.bind();
		 this.navigateTo = Utils.navigateTo.bind(this);
    }

	componentWillUnmount() {
		// _objForm = null;
	}

	componentWillMount(){
	 
	}

	componentDidUpdate(prevProps, prevState) {
	}
	refresh(){
		this.setState({refresh:!this.state.refresh})
	}
	 studentCreated(event){

	 }
	 
	 
	dropDownChangeHandler(type, event)
	{
		_objForm[type] = event.target.value == "Select"? undefined:event.target.value;
		if(type== "art_form"){
			this.setState({
				showCategory : _objForm[type] == "Others"
			})
		}
		
	}
	handleOptionChange(event){
		console.log(' event.target.value   : ', event.target.value);
		this.setState({
    		registration_type: event.target.value
  					});
	}
	inputTextChangeHandler(type, event){
		_objForm[type] = event.target.value;
		console.log(type, event.target.value, _objForm);
	}
	isValidEmail(val){
		return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
	}
	isValid(obj){
		 
	}
	async handleFormSubmit()
	{
	  console.log("Data Missing");
	}
	   
	render() {
		 const { isModalOpen, formType, teamCreated,registration_type } = this.state;
		 const {region, baseTheme} = this.props;
		return (
			<div className="home-wrapper">
				 <Header baseTheme={baseTheme} backToHome={()=>this.navigateTo('/home')}/>
				 <FormHeader   subtitle={this.formSubTitle} baseTheme={baseTheme} backToHome={()=>this.navigateTo('/home')}/>
				 <div className="row row_margin0 padding_0_10"  > 
					 	 <div className="col-md-2"></div>
						  <div className="col-md-8">
						 		 <div className="form_container">
								 	<div className="field_item registration_type">
										<input type="radio" id="individual" name="registraionType" 
										value="individual" 
										checked={registration_type === 'individual'} 
										onChange={this.handleOptionChange}/>
    									<label htmlFor="individual">INDIVIDUAL</label>

										<input type="radio" id="team" name="registraionType" value="team"
										 checked={registration_type === 'team'}
										 onChange={this.handleOptionChange}
										/>
										<label htmlFor="team">GROUP</label>		
									 	
									 </div>	
									 {
										 registration_type =='individual' && <IndividualForm reg_type="individual"  studentCreated={(event)=>this.studentCreated(event)}/>
									 }
 									{
										 registration_type =='team' && <TeamForm/>
									 }


								</div>

						  </div>
						  <div className="col-md-2"></div>
				 
				 </div>
				 {
					 isModalOpen && <AddParticipantForm open={isModalOpen} baseTheme={baseTheme} region={region} formType={formType} formTitle={this.getParticipantTitle(formType)} onClose={this.participantFormClosed} />
				 }
				 {
					 teamCreated && <Result open={teamCreated} baseTheme={this.props.baseTheme} onClose={this.successPopupClosed}/>
				 }
				 <Footer/>

			</div>
		)
	}
}

export default International;
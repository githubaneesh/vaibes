// @flow
import React, {Component} from "react";
import DatePicker from "react-datepicker";
import {getData} from "country-list";
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
import DropdownMenuCompetition from "../../library/dropdown_competition"
// Images

// Style sheet
import './style.scss';
import "react-datepicker/dist/react-datepicker.css";
import Team from "../../../models/team";
import ParticipantAvatar from "../../library/participant_avatar";
import VideoUploader from "../../library/videouploader";
import Utils from "../../../utils/utilityScript";
import TeamService from "../../../services/teamservice";
import HttpService from "../../../services/httpservice";
import ParticipantService from "../../../services/participantservice";
import AccompaniesService from "../../../services/accompaniesservice";
import PaymentService from "../../../services/paymentservice";
import Result from "../../library/result_popup";
import IndividualForm from "../individual";

type Props = {};

let _objForm = null;

class TeamForm  extends Component<Props> {
	formSubTitle= "REGISTRATION FORM";
	countryList
	art_form= ["Select", "Music", "Dance", "Others"];
	 


	constructor(props: Object) {
		super(props);
		this.state = { 
			isModalOpen:false,
			formType:'',
			appearing_date: new Date(),
			departure_date: new Date(),
			arrival_date: new Date(),
			showCategory: false,
			refresh:false,
			teamCreated:false,
			showForm:true,
			submitted:false,
			inputChanged:false
		}
		this.countryList = ["Select", ...getData().map(i=>i.name)];
		_objForm = new Team();
		this.inputTextChangeHandler = this.inputTextChangeHandler.bind(this);
		this.addButtonClick = this.addButtonClick.bind(this);
		this.participantFormClosed = this.participantFormClosed.bind(this);
		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.deleteClickhandler = this.deleteClickhandler.bind(this);
		this.refresh = this.refresh.bind(this);
		this.successPopupClosed = this.successPopupClosed.bind(this);
		this.navigateTo = Utils.navigateTo.bind(this);
		 this.getCompetitions();
    }
	async getCompetitions(){
		  const result = await ParticipantService.instance.getCompetitions();
		  console.log('competition result ',result);
		  if(result){
			result.unshift({_id: "1",name: "Select",machine_name: ""} );
			this.competitions =result;
			this.refresh();
		  }
	}
	componentWillUnmount() {
		_objForm = null;
	}

	componentWillMount(){
		_objForm = new Team();
 	}

	componentDidUpdate(prevProps, prevState) {
	}
	refresh(){
		this.setState({refresh:!this.state.refresh})
	}
	dropDownChangeHandler(type, event)
	{
		_objForm[type] = event.target.value == "Select"? undefined:event.target.value;
		console.log('_objForm   ',_objForm);
        this.setState({
				  inputChange:false  
			});
		
	}
	successPopupClosed(){
		_objForm = new Team();
		this.setState({teamCreated:false,showForm:false})
		const _owner =this;
		setTimeout(function(){  
			_owner.setState({showForm:true })
		 }, 500);

	}
	async deleteClickhandler(participant, key)
	{
		_objForm[key] = _objForm[key].filter(item=>item._id != participant._id);
		let deleteParticipant;
		if(key == "participants") {
			deleteParticipant = await ParticipantService.instance.delete(participant._id);
		}else {
			deleteParticipant = await AccompaniesService.instance.delete(participant._id);
		}
		if(deleteParticipant == "success"){
			this.refresh()
		}
	}

	inputTextChangeHandler(type, event){
		_objForm[type] = event.target.value;
		console.log(type, event.target.value, _objForm);
		this.refresh();
	}
	
	addButtonClick(type)
	{
		this.setState({isModalOpen:true, formType:type})
	}
	participantFormClosed(data)
	{	
		console.log('participantFormClosed   ',data);
		const popupType = this.state.formType;
		if(data && popupType) {
			_objForm[popupType].push(data);
		}
		this.setState({isModalOpen:false,formType:''})
	}
	getTeamObj(){
		const objSend = Object.assign({}, _objForm);
		const {region} = this.props;
		switch (region) {
			case "international" :
				objSend.country = _objForm.country;
				objSend.category = 'int';
				break;
			case "national" :
				objSend.state = _objForm.state;
				objSend.category = 'na';
				break;
			case "state" :
				objSend.state = _objForm.state;
				objSend.category = 'st';
				break;	
			default:
		}
		objSend.participants = _objForm.participants.map(i=>i._id);
		objSend.accompanies = _objForm.accompanies.map(i=>i._id);
		return objSend;
	}
	isValid(obj){
		let booValid = false;
		 
		booValid = obj.name &&  obj.name.length>0  && 
					obj.college &&  obj.college.length>0  && 
					obj.students && obj.students.length>0 
		return booValid;
		 
	}
	handleStudentAdded=(resp)=> {
		if(!_objForm['students']) {
			_objForm['students'] = [];
		}
		console.log('handleStudentAdded : ',resp);
		_objForm['students'].push(resp);
		this.setState({isModalOpen:false})
	}
	async handleFormSubmit()
	{
		const sendObj = {
			name: _objForm.name,
			college: _objForm.college,
			competition: _objForm.competition,			 
			students: (_objForm.hasOwnProperty('students'))?_objForm['students'].map((student)=>student._id):[]
		}
		if(!this.isValid(sendObj)){
			this.setState({submitted:true})
			return false;
		}		

		const response = await ParticipantService.instance.createTeam(sendObj);
		if(response && response._id){
					console.log("Team Created");
					this.setState({
						teamCreated:true
					})
					this.props.studentCreated(response);  
					//this.openPaymentPopup(result);				
		 }

	}
	/*openPaymentPopup(result) {
	const _owner =this;
    let options = {
      "key": "rzp_test_OIoV8XERrqoyEo",
	  "order_id":result.order.order_id,
      "amount": 350*100, 
      "name": "Merchant Name",
      "description": "Purchase Description",
      "image": "/your_logo.png",
      "handler": function (response){
		  console.log('payment response ',response);
		  _owner.paymentSuccesshandler(response);       	  
      },
      "prefill": {
        "name": _objForm['name'],
        "email": ""
      },
      "notes": {
        "address": "Hello World"
      },
      "theme": {
        "color": "#f24993"
      }
    };	 
	let rzp = new window.Razorpay(options);
    rzp.open();
  } 
   async paymentSuccesshandler(data){
	 console.log('data  ',data);
	 const _owner =this;
 	 const result = await PaymentService.instance.paymentSuccess(data);
	 console.log('Team paymentSuccesshandler result  ',result);
	 if(result){		
		 	this.setState({
						teamCreated:true
					})
			this.props.studentCreated(response);  
	 }
  }*/
	renderCategory(){
		if(_objForm["art_form"] === "Others"){
			return (<div className="field_item">
				<label className="field_label">Category</label>
				<InputText type="text" name="" onChange={(e) => this.inputTextChangeHandler("category", e)} />	
			</div>)
		}
		return null
	}
	renderTransport(){
		const {region} = this.props;
		if(region === "national"){
			return (<div className="field_item">
					<label className="field_label">Preferred Convience</label>
					<InputText type="text" placeholder={"Flight/Train"} name="" onChange={(e) => this.inputTextChangeHandler("transport", e)} />	
				</div>)
		}
		return null
	}
	getParticipantTitle(key){
		return key == "participants"? "Participant": "Accompanist"
	}
	renderAvatar (key){
		const keyName = this.getParticipantTitle(key);
		return _objForm && _objForm[key].length > 0 && _objForm[key].map(item=>{
			return (<ParticipantAvatar refresh={this.state.refresh} key={item._id} item={item} title={keyName} baseTheme={this.props.baseTheme} deleteClick={(p)=>this.deleteClickhandler(p, key)} />)
		})
	}
	renderCountryStateDropDown() {
		const {region} = this.props;
		switch (region) {
			case "international" :
				return (<div className="field_item">
						<label className="field_label">Name of the country<span className="mandatory"><sup>*</sup></span></label>
						<DropdownMenu items={this.countryList}  handleChange={(e) => this.dropDownChangeHandler("country", e)}/>
				</div>)
			case "national" :
				const state_arr = new Array("Select","Andaman & Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Daman & Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Pondicherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Tripura", "Uttar Pradesh", "Uttaranchal", "West Bengal");

				return (<div className="field_item">
						<label className="field_label">Name of the state<span className="mandatory"><sup>*</sup></span></label>
						<DropdownMenu items={state_arr}  handleChange={(e) => this.dropDownChangeHandler("state", e)}/>
				</div>)
			default:
				return null;
		}
		
	}
	render() {
		 const { isModalOpen, formType, teamCreated,showForm,submitted } = this.state;
		 const {region, baseTheme} = this.props;
		return (
			<div className="home-wrapper">
				 
				 <div className="row row_margin0"  > 
					 	 
						  <div className="col-md-12">
						 		 <div className="form_container">
									{ 
									showForm &&<form>
											{
												this.renderCountryStateDropDown()
											}
											<div className="field_item">
												<label className="field_label">Group name<span className="mandatory"><sup>*</sup></span>:</label>
                      							<InputText type="text" name="" onChange={(e)=>this.inputTextChangeHandler("name", e)} 
												className={(submitted && !_objForm.hasOwnProperty('name')  )?'ip_text_error':'ip_text'}  
												  />
											</div>
											<div className="field_item">
												<label className="field_label">College name<span className="mandatory"><sup>*</sup></span>:</label>
                      							<InputText type="text" name="" onChange={(e)=>this.inputTextChangeHandler("college", e)}
												  className={(submitted && !_objForm.hasOwnProperty('college')  )?'ip_text_error':'ip_text'}
												 />
											</div>
											<div className="field_item">
												<label className="field_label">Competitions</label>
											<DropdownMenuCompetition items={this.competitions}  handleChange={(e) => this.dropDownChangeHandler("competition", e)}
															className={(submitted && !_objForm.hasOwnProperty('competition')  )?'select_error':'select'}														 
														 />

											</div>
											<div className="field_item">
													<div><label className="field_label">Add participants<span className="mandatory"><sup>*</sup>:</span></label></div>
													<div className="particiants-col">
														{
															this.renderAvatar("participants")
														}
														<AddButton id="participants" onClick={this.addButtonClick} />

													</div>
													{
														_objForm['students'] && <div className="student-list">
															<span>Student list:</span>
														<table>
															<thead>
																<tr>
																   <th className="THpadding">Index</th>
																   <th className="THpadding">Name</th>
																   <th className="THpadding">Payment</th>
																</tr>
															</thead>
															<tbody>
															{
															_objForm['students'].map((student, index)=> {
																return <tr key={'student'+index}>
																	<td className="Td">{(index+1)  }</td>
																	<td className="Td">{student.name}</td>
																	<td className="Td">{ (student.payment_status ==1)? 'Success':'Failed'   }</td>
																</tr>
															})
															}
															</tbody>
														</table>
													</div>
													}
													<div className="clearfix"></div>
											</div>
											<div className="field_item pull-left">
												{
												(submitted && !_objForm.hasOwnProperty('students'))&&	<h5 className="error">Please add participants</h5>
												}
											</div>

											<div className="field_item pull-right">
												
													<Button name=""  value="SUBMIT" bgColor={baseTheme} onClick={this.handleFormSubmit} />
											</div>
									 </form>
}


								</div>

						  </div>
						  
				 
				 </div>
				 {
					 isModalOpen && <AddParticipantForm 
					 studentCreated={this.handleStudentAdded}
					 open={isModalOpen}
					 baseTheme={baseTheme}
					 region={region}
					 formType={formType}
					 formTitle={this.getParticipantTitle(formType)} 
					 onClose={this.participantFormClosed} />
				 }
				 {
					 teamCreated && <Result open={teamCreated} baseTheme={this.props.baseTheme} onClose={this.successPopupClosed}/>
				 }
				 

			</div>
		)
	}
}

export default TeamForm;
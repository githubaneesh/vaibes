// @flow
import React, {Component} from "react";
import DatePicker from "react-datepicker"; 
import topImage from '../../../assets/images/home/top_image.png';
import botomImage from '../../../assets/images/home/bottom_image.png';
import Header from '../../library/header';
import Footer from  "../../library/footer";
import FormHeader from "../../library/form_header";
import DropdownMenu from "../../library/dropdown";
import DropdownMenuCompetition from "../../library/dropdown_competition"
import AddButton from "../../library/addbutton";
import TextArea from "../../library/textarea";
import InputText from "../../library/inputtext";
import Button from "../../library/button";
//import AddParticipantForm from "../../forms/addparticipant";
// Images

// Style sheet
import './style.scss';
import "react-datepicker/dist/react-datepicker.css";
import Participant from "../../../models/participant";
import ParticipantService from "../../../services/participantservice";
import PaymentService from "../../../services/paymentservice";
/*import Team from "../../../models/team";
import ParticipantAvatar from "../../library/participant_avatar";
import VideoUploader from "../../library/videouploader";
import Utils from "../../../utils/utilityScript";
import TeamService from "../../../services/teamservice";
import HttpService from "../../../services/httpservice";
import ParticipantService from "../../../services/participantservice";
import AccompaniesService from "../../../services/accompaniesservice";*/
import Result from "../../library/result_popup";

type Props = {};

let _objForm = null;
class IndividualForm  extends Component<Props> {
	formSubTitle= "REGISTRATION FORM";
	countryList 
	genders= ["Select", "Male", "Female", "Others"];
	competitions =[];
	// age_group =[{id:1,label:'5-10'},{id:2,label:'11-15'}]


	constructor(props: Object) {
		super(props);
		this.state = { 
			refresh: true,
		 	dob: new Date(),
			student_status:'',
			particpantCreated:false,
			age:'',
			submitted:false,
			inputChange:false,
			showForm:true
			 
		}
	   _objForm = new Participant();
	   this.dateChangeHandler = this.dateChangeHandler.bind(this);
	   this.handleCollegeOptionChange = this.handleCollegeOptionChange.bind(this);
	   this.successPopupClosed = this.successPopupClosed.bind(this);
	   this.handleFormSubmit = this.handleFormSubmit.bind(this);
	   this.refreshUI = this.refreshUI.bind(this);
	   this.openPaymentPopup = this.openPaymentPopup.bind(this);
	   this.paymentSuccesshandler = this.paymentSuccesshandler.bind(this);
	   this.getCompetitions();
	   //this.openPaymentPopup();
	  // this.isValid = this.isValid.bind(this);
   }

	componentWillUnmount() {
		 _objForm = null;
	}

	componentWillMount(){
	 
	}

	componentDidUpdate(prevProps, prevState) {
	}
	async getCompetitions(){
		  const result:any = await ParticipantService.instance.getCompetitions();
		  console.log('competition result ',result);
		  if(result){
			result.unshift({_id: "1",name: "Select",machine_name: ""} );
			this.competitions =result;
			this.refreshUI();
		  }
	}
	refreshUI() { this.setState( { refresh : !this.state.refresh }) }
    dateChangeHandler(date, type){
		
		const d = date.toLocaleDateString();
		_objForm[type] = d;
		_objForm['age'] = this.getAge(d);
		console.log(d);
		console.log('this.getAge(d)  :',this.getAge(d));
		this.setState({
			[type]: date,
			age:this.getAge(d),
		   inputChange:false 
		  })
	}
	 
	dropDownChangeHandler(type, event)
	{
		_objForm[type] = event.target.value == "Select"? undefined:event.target.value;
        this.setState({
				  inputChange:false  
			});
		
	}
	handleCollegeOptionChange(event){
		console.log('event checked  ',event.target.checked);
		_objForm['student_status'] = (event.target.checked)? 'Private':'Going' ;
		_objForm['college'] = (event.target.checked)? '': _objForm['college'] ;
		this.setState({
				student_status :  (event.target.checked)?1:0,
				inputChange:false  
		 })
	}
	inputTextChangeHandler(type, event){
		_objForm[type] = event.target.value;
		this.setState({			 
				inputChange:false  
		 })
		console.log(type, event.target.value, _objForm);
	}
	successPopupClosed(){
		_objForm = new Participant();
		this.setState({particpantCreated:false,
					   inputChange:false,
					   refresh:!this.state.refresh ,
					   showForm:false,
					  age:'',
					  dob: new Date(),
					  student_status:''					
				 })
		console.log('successPopupClosed');
		const _owner =this;
		setTimeout(function(){  
			_owner.setState({showForm:true })
		 }, 500);
 		//this.refreshUI();
 	}
	isValidEmail(val){
		return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
	}
	isValid(obj){
		let booValid = false;
		 if(this.props.reg_type == 'individual'){
				booValid = 	obj.name  && obj.gender && obj.student_status &&
				(this.state.student_status ==1)? obj.college =='': obj.college && obj.qualification  && obj.year  &&
					obj.dob  && obj.parents_name  &&  obj.parents_phone  && obj.parents_phone.length >0 &&
					obj.address  && obj.phone && obj.phone.length >0 && obj.competition

		 }else{
				booValid = 	obj.name  && obj.gender &&  
				    obj.qualification  && obj.year  &&
					obj.dob  && obj.parents_name  &&  obj.parents_phone  && obj.parents_phone.length >0 &&
					obj.address  && obj.phone && obj.phone.length >0  
		 }
		 console.log('booValid   ',booValid);
		return booValid ;
		
	}
	getAge(dob)
	{   const today = new Date();
		const dobArr = dob.split('/');
		var age = today.getFullYear() - dobArr[2];
		var m = today.getMonth() - dobArr[0]  ;
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	}

	async handleFormSubmit(){
	  console.log('_objForm  : ',_objForm);
	 // const formData = Object.assign({}, _objForm);
	 	if(!_objForm.hasOwnProperty('student_status')){
			_objForm['student_status'] = 'Going';
		 }

  		 if(!this.isValid(_objForm)){
			this.setState({submitted:true});
			return;
		   }
		 _objForm.i_agree =1;
		 _objForm.order =  'i' ;
		 const result = await ParticipantService.instance.create(_objForm);
		 if(result && result._id){
					console.log("Participate Created",result );
				  	this.openPaymentPopup(result);
				/* if(this.props.reg_type == 'individual'){ }
				 else{
					this.setState({
						particpantCreated:true
					})
					this.props.studentCreated(result);
				 }*/	 
		 }
		 return; 		   
		  console.log("Data Missing");
	}
	openPaymentPopup(result) {
	const _owner =this;
    let options = {
      "key": "rzp_test_OIoV8XERrqoyEo",
	  "order_id":result.order.order_id,
      "amount": 350 * 100, 
      "name": "Vaibes",
      "description": "Registration Fee",
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
        "address": ""
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
	 console.log('individual paymentSuccesshandler result  ',result);
	 if(result){		
		  _owner.setState({
						particpantCreated:true
		  })
		  _owner.props.studentCreated(result);
	 }
  }
	render() {
		 const {student_status,particpantCreated,age,submitted,showForm } = this.state;
		 const {reg_type} = this.props;
		return (
			<div className="home-wrapper">
				 
				 
				 <div className="row row_margin0"  > 
					 	 
						  <div className="col-md-12">
						 		 <div className="form_container">
									{ 
								 	showForm && <form>
                                         	<div className="field_item">
													<label className="field_label">Name<span className="mandatory"><sup>*</sup></span></label>
												   <InputText type="text"    name="" onChange={(e) => this.inputTextChangeHandler("name", e)} 
												   className={(submitted && !_objForm.hasOwnProperty('name')  )?'ip_text_error':'ip_text'}/>
											</div>
											<div className="field_item">
													<div className="row row_margin0"  > 
														 <div className="col-md-6">
														  <div><label className="field_label">Date of Birth (MM/DD/YYYY)</label></div>
																<DatePicker	
																     peekNextMonth
																	showMonthDropdown
																	showYearDropdown
																	dropdownMode="select"																 
																	selected={this.state.dob}
																	maxDate={ new Date()}
																	onChange={(e) => {this.dateChangeHandler(e, "dob")}}/>
														 </div>{
															/* <div className="col-md-4">
														 	<label className="field_label">Age<span className="mandatory"><sup>*</sup></span></label>
															<InputText type="number" name="" value={age} readOnly 
															onChange={(e) => this.inputTextChangeHandler("age", e)}
															className={(submitted && !_objForm.hasOwnProperty('age')  )?'ip_text_error':'ip_text'}
															 />
														 </div>	*/ 
														 }
														
														 <div className="col-md-6">
														 		<label className="field_label">Gender<span className="mandatory"><sup>*</sup></span></label>
													 <DropdownMenu items={this.genders}  handleChange={(e) => this.dropDownChangeHandler("gender", e)}
															className={(submitted && !_objForm.hasOwnProperty('gender')  )?'select_error':'select'}														 
														 />
														 </div>													
													</div>													
											</div>
										 {
										(reg_type=='individual')&&	<div className="field_item">

													<div className="row row_margin0"  > 
														 <div className="col-md-6">
														 	 	<label className="field_label">College<span className="mandatory"><sup>*</sup></span></label>
																<InputText type="text" name="" onChange={(e) => this.inputTextChangeHandler("college", e)}
																readOnly={(student_status==1)?true:false} 
																value={(student_status==1)?'':_objForm['college']}
																className={(submitted && !_objForm.hasOwnProperty('college')  )?'ip_text_error':'ip_text'}
																 />
														 </div>
														 <div className="col-md-6 ">
															 <label className="field_label"></label>
															 <label className="checkbox-container">Private
																<input type="checkbox"  
																checked={student_status === 1} 
																	onChange={this.handleCollegeOptionChange}
																/>
																<span className="checkmark"></span>
															 </label>
															 
														 </div>													
													</div>	
 											</div>
											 }
											<div className="field_item">
													<div className="row row_margin0"  > 
														 <div className="col-md-6">
														 	 		<label className="field_label">Qualification<span className="mandatory"><sup>*</sup></span></label>
																	<InputText type="text" name="" onChange={(e) => this.inputTextChangeHandler("qualification", e)} 
																	className={(submitted && !_objForm.hasOwnProperty('qualification')  )?'ip_text_error':'ip_text'}
																	/>	 
														 </div>
														 <div className="col-md-6">
														 			<label className="field_label">Year<span className="mandatory"><sup>*</sup></span></label>
																	<InputText type="number" name="" onChange={(e) => this.inputTextChangeHandler("year", e)}
																	className={(submitted && !_objForm.hasOwnProperty('year')  )?'ip_text_error':'ip_text'}
																	 />
														</div>
												    </div>		 



												
											</div>
											{(reg_type=='individual')&&
											<div className="field_item">
												<label className="field_label">Competitions</label>
											<DropdownMenuCompetition items={this.competitions}  handleChange={(e) => this.dropDownChangeHandler("competition", e)}
															className={(submitted && !_objForm.hasOwnProperty('competition')  )?'select_error':'select'}														 
														 />

											</div>
											 }
											<div className="field_item">
													<label className="field_label">Parent Details</label>
														<div className="row row_margin0"  > 
														 <div className="col-md-6">
														 		<label className="field_label">Name of Parent  <span className="mandatory"><sup>*</sup></span></label>
																<InputText type="text" name="" onChange={(e) => this.inputTextChangeHandler("parents_name", e)} 
																className={(submitted && !_objForm.hasOwnProperty('parents_name')  )?'ip_text_error':'ip_text'}
																/>
														 </div>
														 <div className="col-md-6">
														 		<label className="field_label">Phone number of Parent<span className="mandatory"><sup>*</sup></span></label>
																<InputText type="number" name="" onChange={(e) => this.inputTextChangeHandler("parents_phone", e)}
																className={(submitted && !_objForm.hasOwnProperty('parents_phone') || submitted && _objForm.hasOwnProperty('parents_phone') && _objForm['parents_phone'].length!=10 )?'ip_text_error':'ip_text'}
																 />
														 </div>
													 	</div>
											</div>
											<div className="field_item">
												 
												<div className="row row_margin0"  > 
														 <div className="col-md-6">
														 		<label className="field_label">Address<span className="mandatory"><sup>*</sup></span></label>
																 <TextArea rows={5} cols={50} onChange={(e) => this.inputTextChangeHandler("address", e)}
																className={(submitted && !_objForm.hasOwnProperty('address')  )?'ip_text_error':'ip_text'}	 
																	 />
														 </div>
														 <div className="col-md-6">
														 		<label className="field_label">Phone Number<span className="mandatory"><sup>*</sup></span></label>
																<InputText type="number" name="" onChange={(e) => this.inputTextChangeHandler("phone", e)}
																className={(submitted && !_objForm.hasOwnProperty('phone') || submitted && _objForm.hasOwnProperty('phone') && _objForm['phone'].length !=10 )?'ip_text_error':'ip_text'}	 
																 />
																 <h5>Registration open to all college students from Degree to PG</h5>
																 <div className=" pull-right">												
																	<Button name=""  value="SUBMIT"  onClick={this.handleFormSubmit} />
																</div>
														 </div>
											   </div>													 
											</div> 
									 </form>
}


								</div>

						  </div>
						  
				 
				 </div>
				  {
					 particpantCreated && <Result open={particpantCreated}   onClose={this.successPopupClosed}/>
				 }
				 </div>
		)
	}
}

export default IndividualForm;
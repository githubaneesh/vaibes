import React, { Component } from "react";
import { Link } from "react-router-dom";
import Modal from 'react-responsive-modal';
import classNames from 'classnames'
import Dropzone from 'react-dropzone';
import ImageUploader from "../../library/image_browse";
import InputText from "../../library/inputtext";
import Button from "../../library/button";
import ImageAddButton from "../../library/imageaddbutton";
import ImageUploadWindow from "../../library/image_upload_window";
import ThumbImage from "../../library/thumb_image";
import "./style.scss";
import Participant from "../../../models/participant";
import Accompanies from "../../../models/accompanies";
import Identity from "../../../models/identity";
import ParticipantService from "../../../services/participantservice";
import AccompaniesService from "../../../services/accompaniesservice";
import DropdownMenu from "../../library/dropdown";
import IndividualForm from "../../pages/individual";
type Props = {
  
};

 
const _Identities = ["Select", "Passport", "Aadhar", "Voter Id", "license"];
const _Genders = ["Select", "Male", "Female"];
let _objForm=null;
let _arrIds=[];
class AddParticipantForm extends Component<Props> {

  files: any;
  imageFile:Object;
  imageFileName:string;
  imageType:string;


  idProofImages:Array<Object>=[];
  photoImage:Object;

  constructor(props: Object) {
    super(props);
    this.state = {
      isImageWindowOpen:false,
      showMessage: "",
      identity: this.props.region =="international"?"Passport":""
    }
    _arrIds = []
    this.inputTextChangeHandler = this.inputTextChangeHandler.bind(this)
    this.dropDownChangeHandler = this.dropDownChangeHandler.bind(this)
    this.imageBrowsehandler = this.imageBrowsehandler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onClose = this.onClose.bind(this)
  }
  getFormObject() {
    return this.props.formType == "participants"? new Participant() : new Accompanies();
  }
  componentWillMount() {
    _objForm = this.getFormObject();
    if(this.props.region === "international") {
      _objForm.identity.type = "passport";
    }
  }
  componentWillUnmount() {
    _objForm = null;
    _arrIds = [];
  }
  isValid() {
    const {region, formType} = this.props;
    console.log(_objForm);
    return _objForm && 
          _objForm["name"] &&  _objForm["name"].trim().length != 0 &&
          _objForm["age"] &&  _objForm["age"] > 14 &&  _objForm["age"] <= 30 && 
          _objForm["gender"] && _objForm["gender"] != "Select" && 
          ((_objForm["identity"]["num"] && _objForm["identity"]["num"].trim().length != 0) || this.props.region !== "international") &&
          _objForm["identity"]["images"].length != 0 && _objForm["photo"]
  }
  onClose(){
    this.props.onClose()
  }
  handleSubmit= async ()=> {
    const {region, formType} = this.props;
    if(this.isValid()){
      let participant;
      if(formType == "participants") {
          participant = await ParticipantService.instance.create(_objForm);
      }else {
          participant = await AccompaniesService.instance.create(_objForm);
      }
      if(participant && participant._id){
        _arrIds.push(participant._id);
        this.setState({showMessage:"Created..."});
        // _objForm = this.getFormObject();
        this.props.onClose(participant)
      }
      return;
    }
    console.log("Data Missing");
    
  }
  dropDownChangeHandler(event, key)
	{
    if(key){
      _objForm[key] = event.target.value;
    }else{
      _objForm["identity"]["type"] = event.target.value.replace(/\s/g,'').toLowerCase();
      this.setState({
        "identity": event.target.value == "Select"? "": event.target.value
      })
    }
    
	}
  inputTextChangeHandler(event, key, key2 ){
    if(key2){
      _objForm[key][key2] = event.target.value;
    }else{
      _objForm[key] = event.target.value;
    }
	}
  openImageUploadWindow(event)
  {
    this.files = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const filename = file.name;
      var reader = new FileReader();
      reader.onload = (e) => {
        this.imageFileName = filename;
        this.imageFile = e.target.result;       
        this.setState({isImageWindowOpen:true});
      }  
      reader.readAsDataURL(file);
    } 
  }

  imageBrowsehandler(type, event)
  {
    this.imageType = type;
    this.openImageUploadWindow(event);
  }
  ImageBrowseWindowClosed()
  {
    this.setState({isImageWindowOpen:false});
  }
  imageUploadHandler(event, imagePath)
  {
    console.log("close window imageUploadHandler", imagePath)
    switch(this.imageType)
    {
      case 'idproof':
        this.idProofImages.push(this.imageFile);
        _objForm.identity.images.push(imagePath)
      break;
      case 'photo':
        this.photoImage = this.imageFile;
        _objForm.photo = imagePath;
      break;
    }    
    this.setState({isImageWindowOpen:false});
  }

  render(){
    const {formType, formTitle, open} = this.props
	  return(
    <Modal open={open} onClose={this.onClose} center closeOnEsc={false} closeOnOverlayClick={false}>
       <IndividualForm reg_type="team" studentCreated={this.props.studentCreated}/>   
    </Modal>  
   
    );
  }
}

export default AddParticipantForm;
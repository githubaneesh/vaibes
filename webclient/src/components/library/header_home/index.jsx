// @flow
import React, {Component} from "react";
import topImage from '../../../assets/images/header/header.png'; 
import logo from '../../../assets/images/header/oneness.png'; 
import Utils from "../../../utils/utilityScript";
// Images

// Style sheet
import './style.scss';
import Button from "../button";

type Props = {}
 
class Header  extends Component<Props> {
	constructor(props: Object) {
		super(props);
		this.backToHome = this.props.backToHome.bind(this);
		this.navigateTo = Utils.navigateTo.bind(this);
	}
 
	render() {
		const {totalTeam}=this.props;
		return (
		  		 <div className="topImg-container">		
				 	 <div className="header-container">
					 	<img src={topImage}/>
						 <div className="registration_con">
							 <div className="reg_button" onClick={this.backToHome}>REGISTER NOW</div>
							{
								/*
								 <div className="row">
								 <div className="col-md-3"></div>
								 <div className="col-md-3">
								 	<div className="reg_button">REGISTER NOW</div>
								 </div>
								 <div className="col-md-6"></div>
							 </div>
								*/ 
							}
						 	
						 </div>		
				  </div>			 	
				</div>	 
		)
	}
}

export default Header;
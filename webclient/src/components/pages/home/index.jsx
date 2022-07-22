// @flow
import React, {Component} from "react";
import topImage from '../../../assets/images/home/top_image.png';
import botomImage from '../../../assets/images/home/bottom_image.png';
import Header from '../../library/header_home';
import Footer from  "../../library/footer";
// Images

// Style sheet
import './style.scss';
import Utils from "../../../utils/utilityScript";

type Props = {}
 
class Home  extends Component<Props> {
	constructor(props: Object) {
		super(props);
		this.navigateTo = Utils.navigateTo.bind(this);
    }
 
	render() {
		return (
			<div className="home-wrapper">
				 <div className="topImg-container">		
				{
				/*<img src={topImage}/>*/
				 <Header   backToHome={()=>this.navigateTo('/register')}/>
				} 	 
				 </div>
				 <div className="nav-button-container">
					
					<div className="nav-button-con">
						<div className="endevour-label"><h2>An endeavour to brighten up the young spirit and lead to future</h2></div>
								<div className="row ">	 
									<div className="col-md-4">
										<div className="about_con" >
											<h3> About <br/>Vaibes 2020</h3>
											<h5>Brimming with energy and ideas, the youth which form the most constructive groups of any civil society is indeed a force to reckon with. A minor slip in their foresight can ruin up a whole generation and those to follow. Vibes 2020 is an effort to groom them in the right direction, providing them with the best of support and opportunities.</h5>
										</div>
									  </div> 
									<div className="col-md-4">
											<div className="precursor_con" >
											<h3> Pre-cursor to <br/> Vaibes 2020</h3>
											<h5>A panel consisting of doctors, psychologists, employers and trainers will hold  interactive sessions with the youth at their respective educational institutions prior to  the public programmes. Through these, we intend to impart to our younger minds, a spirit of selflessness and responsibility, along with conviction and courage to pursue their life goals.</h5>
										</div>
									</div> 
									<div className="col-md-4">
										 	<div className="sequential_con" >
											<h3> A sequential <br/> Programme Schedule</h3>
											<h5>A rally comprising of nearly 1000 participants from Manaveeyam Veedhi to Kanakakkunnu Palace, a flash mob and a teaser launch will flag off the Vibes Series in the first week of January. The evening programme will be honoured by many
											distinguished guests, the details of which would be briefed in a press meet at Mascot Hotel, earlier on the same day.
											</h5>
										</div>
									</div> 
								 </div>
								<div className="competition-label"><h2>COMPETITIONS</h2></div>
					<div className="competition-item-label"><h4>TED Talk | Best Management Team | He & She Entrepreneurship | Mime</h4></div>
					<div className="competition-item-label"><h4>Best Advertisement team | Dance | Voice of Vaibes | Spot Choreography</h4></div>
				 	<div className="competition-item-label"><h4>Photography Spot | Tik Tock | Treasure hunt | Target Games</h4></div>
 					</div>
					
				 </div>
				 {/* <div className="bottomImg-container">
				 <h4></h4>
				
				  <img src={botomImage}/>
				 				
				 </div>*/}
				  <Footer/>

			</div>
		)
	}
}

export default Home;
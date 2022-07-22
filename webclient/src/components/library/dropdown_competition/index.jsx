// @flow
import React, {Component} from "react";
 
// Images

// Style sheet
import './style.scss';

type Props = {}
 
class DropdownMenuCompetition  extends Component<Props> {
    items:Array<any>;
	constructor(props: Object) {
        super(props);
        this.state = {value: ''};
        this.items = this.props.items;
		this.handleChange = this.handleChange.bind(this);
    }

	handleChange(e){
		this.setState({value: e.target.value});
		this.props.handleChange(e);
	}
 	render() {
		return (
            <select value={this.state.value} onChange={this.handleChange} className={this.props.className}>
                       { this.props.items && this.props.items.map(function(item, index){
                           if(item._id){
                            return  <option value={item._id}  key={item._id} >{item.name }</option> ;
                           }
                         return  <option value={item}  key={item} >{item }</option> ;
                        })} 
            </select>
		)
	}
}

export default DropdownMenuCompetition;
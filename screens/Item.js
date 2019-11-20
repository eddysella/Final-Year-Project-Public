import React, { Component } from 'react'
import { ListItem} from 'react-native-elements';
import { SvgUri } from 'react-native-svg';

export default class Item extends React.PureComponent {

     ShouldComponentUpdate(){
         return false;
     }

    render() {
        return (
            <ListItem
                title={`${this.props.name}`}
                leftAvatar={{source: {uri: `${this.props.img}`}}}
            />
        );
    }
}

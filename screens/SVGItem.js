import React, { Component } from 'react'
import { ListItem} from 'react-native-elements';
import { SvgUri } from 'react-native-svg';

export default class SVGItem extends React.PureComponent {

     ShouldComponentUpdate(){
         return false;
     }

    render() {
        return (
            <ListItem
                title={`${this.props.name}`}
                leftAvatar={
                    <SvgUri
                    viewBox="0 0 640 480"
                    width='70'
                    height='50'
                    uri= {`${this.props.img}`}
                    />
                }
            />
        );
    }
}

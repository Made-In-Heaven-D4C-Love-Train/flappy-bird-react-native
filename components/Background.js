import React from "react";
import { View } from "react-native";
import Cloud from "./Cloud";

const Background = (props) => {
  return (
    <View>
      <Cloud top={10} v={1000} paused={props.paused} setPaused={props.setPaused}/>
      <Cloud top={-200} v={1500} paused={props.paused} setPaused={props.setPaused}/>
    </View>
  );
};

export default Background;
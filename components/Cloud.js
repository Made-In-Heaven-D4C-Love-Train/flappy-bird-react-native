import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, AsyncStorage, Dimensions } from 'react-native';
import { godMode } from '../GodMode';
//import { paused, setPaused } from '../Pause';

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
console.log("width:"+windowWidth)
const Cloud = ({top, v, paused, setPaused}) => {
    const [x, setX] = useState(v);
    const limit = -1000;
    const [startTime, setStartTime] = useState(Date.now());
    useEffect(() => {
      
      const intervalId = setInterval(() => {
        //let currentX = x;
        const elapsedTime = Date.now() - startTime;
        const currentX = v * (elapsedTime / 1000);
        let vitesse = 0;
      if(godMode === true) vitesse = 20
      else vitesse = 10
      //console.log(paused)
      if(paused){
        setX(currentX => currentX)
      }else{
        setX(currentX => currentX < limit ? currentX + 2000 : currentX - vitesse);
      }
      
      
        //console.log("x : "+currentX)
      }, 50);
      return () => clearInterval(intervalId);

    }, [paused]);
  
    useEffect(() => {
      //console.log('Current x: ', paused);
    }, [paused]);
  return (
    
    <Image
      source={require('../assets/cloud.png')}
       style={{
         position: 'absolute',
         top: top,
         left: x,
         bottom: 0,
         right: 0,
         resizeMode: 'contain',
         width: 160,
         height: 75
         //tintColor: 'black'
      }}
     />
    
  );
};

export default Cloud;

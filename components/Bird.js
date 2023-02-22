import Matter from 'matter-js'
import React from 'react'
import { View, Image } from 'react-native'

const Bird = props => {
const widthBody = props.body.bounds.max.x - props.body.bounds.min.x
const heightBody = props.body.bounds.max.y - props.body.bounds.min.y
const xBody = props.body.position.x - widthBody /2
const yBody = props.body.position.y - heightBody /2
// const color = props.color;
const max = Math.max(widthBody, heightBody)
return(
    // <View style={{ borderWidth: 1, borderColor: color, borderStyle: 'solid', position: 'absolute', left: xBody, top: yBody, width: widthBody, height: heightBody, backgroundColor: color}}>
    <Image
      style={{
        position: 'absolute',
        left: xBody,
        top: yBody,
        width: 50,
        height: 40, // + 10
        //backgroundColor: '#4eadf5' //#4eadf5
      }}
      source={require('../assets/flappy-bird-pixel-art-test-photoshop-2.png')}
    />
    
)
}
export default (world, pos, size) => {
  //const initialBird = Matter.Bodies.rectangle(pos.x, pos.y, size.width, size.height, {label: 'Bird'})
  
  const initialBird = Matter.Bodies.circle(pos.x, pos.y, 16)
 //const initialBird = Matter.Bodies.
  Matter.World.add(world, [initialBird])
  return{
    body: initialBird,
     pos,
     renderer: <Bird/>
}
}

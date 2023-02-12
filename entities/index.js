import Matter from "matter-js"
import Bird from "../components/Bird";
import Floor from "../components/Floor";
import { Dimensions } from 'react-native'
import Obstacle from "../components/Obstacle";
import { getPipeSizePosPair } from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const pipeSizePosA = getPipeSizePosPair()
const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)

  
export default restart => {
    let engine = Matter.Engine.create({enableSleeping: false})
    let world  = engine.world
    world.gravity.y = 0.4;
    const n = 4;
      
    const entities = {
        physics: {engine, world},
        Bird: Bird(world, 'yellow', {x: 50, y: 300}, {height: 40, width: 40}),
        Floor: Floor(world, 'green', {x: windowWidth / 2, y: windowHeight}, {height: 50, width: windowWidth})
    };

    
    for (let i = 0; i < n; i++) {
        const pipeSizePos = getPipeSizePosPair(windowWidth * (0.9 + i));
        entities[`ObstacleTop${i + 1}`] = Obstacle(world, `ObstacleTop${i + 1}`, 'red', pipeSizePos.pipeTop.pos, pipeSizePos.pipeTop.size);
        entities[`ObstacleBottom${i + 1}`] = Obstacle(world, `ObstacleBottom${i + 1}`, 'red', pipeSizePos.pipeBottom.pos, pipeSizePos.pipeBottom.size);
    }

    return entities;
};

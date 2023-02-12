import Matter from "matter-js";
import { getPipeSizePosPair } from "./utils/random";
import { Dimensions } from "react-native";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
//console.log(windowWidth)
//console.log(windowHeight)
const n = 4;
const Physics = (entities, {touches, time, dispatch}) => {
    let engine = entities.physics.engine

    touches.filter(t => t.type === 'press').forEach(t => {
        Matter.Body.setVelocity(entities.Bird.body, {
            x:0,
            y: -8,
        })
    })
    Matter.Engine.update(engine, time.delta)
    for (let index=0; index<n; index++){
        if(entities[`ObstacleTop${index + 1}`].body.bounds.max.x <= 50 && !entities[`ObstacleTop${index + 1}`].point){
            entities[`ObstacleTop${index + 1}`].point = true;
            dispatch({type: 'new_point'});
            
        }
     if(entities[`ObstacleTop${index + 1}`].body.bounds.max.x <= 0){
         const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9)
        Matter.Body.setPosition(entities[`ObstacleTop${index + 1}`].body, pipeSizePos.pipeTop.pos)
         Matter.Body.setPosition(entities[`ObstacleBottom${index + 1}`].body, pipeSizePos.pipeBottom.pos)
         entities[`ObstacleTop${index + 1}`].point = false;
    }
    Matter.Body.translate(entities[`ObstacleTop${index + 1}`].body, {x: -3, y:0})
    Matter.Body.translate(entities[`ObstacleBottom${index + 1}`].body, {x: -3, y:0})
    }
    if (entities.Bird.body.position.y > windowHeight || entities.Bird.body.position.y < 0) {
        // Matter.Body.setPosition(entities.Bird.body, { x: windowWidth / 2, y: windowHeight / 2 })
        dispatch({ type: 'game_over' })
      }
    
    Matter.Events.on(engine, 'collisionStart', () => {
        dispatch({type: 'game_over'})
    })
    return entities;
}


export default Physics
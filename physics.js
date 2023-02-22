import Matter from "matter-js";
import { getPipeSizePosPair } from "./utils/random";
import { Dimensions } from "react-native";
import { godMode, setGodMode } from './GodMode';
import { useState } from "react";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const n = 4;
const obstacleSpeed = -3;

const Physics = (entities, {touches, time, dispatch}) => {
    let engine = entities.physics.engine;
    
    // Récupérer l'événement de pression du joueur sur l'écran
    const jumpTouches = touches.filter(t => t.type === 'press');
    
    // Appliquer une impulsion à l'oiseau en fonction des événements de pression
    jumpTouches.forEach(() => {
        Matter.Body.setVelocity(entities.Bird.body, {
            x: 0,
            y: -8,
        });
    });
    
    // Mettre à jour le moteur physique
    Matter.Engine.update(engine, time.delta);
    
    // Mettre à jour la position des obstacles
    for (let index=0; index<n; index++){
        const obstacleTop = entities[`ObstacleTop${index + 1}`];
        const obstacleBottom = entities[`ObstacleBottom${index + 1}`];
        
        // Vérifier si l'obstacle a été franchi
        if(obstacleTop.body.bounds.max.x <= 50 && !obstacleTop.point){
            obstacleTop.point = true;
            dispatch({type: 'new_point'});
        }
        
        // Repositionner l'obstacle une fois qu'il est sorti de l'écran
        if(obstacleTop.body.bounds.max.x <= 0){
            const pipeSizePos = getPipeSizePosPair(windowWidth * 0.9)
            Matter.Body.setPosition(obstacleTop.body, pipeSizePos.pipeTop.pos);
            Matter.Body.setPosition(obstacleBottom.body, pipeSizePos.pipeBottom.pos);
            obstacleTop.point = false;
        }
        
        // Déplacer les obstacles horizontalement
        Matter.Body.translate(obstacleTop.body, {x: obstacleSpeed, y: 0});
        Matter.Body.translate(obstacleBottom.body, {x: obstacleSpeed, y: 0});
    }
    
    // Vérifier si l'oiseau est sorti de l'écran ou s'il est entré en collision avec un obstacle
    if (entities.Bird.body.position.y > windowHeight || entities.Bird.body.position.y < 0) {
        dispatch({ type: 'game_over' })
    }
    Matter.Events.on(engine, 'collisionStart', () => {
        dispatch({type: 'game_over'})
    })
    
    return entities;
}

export default Physics;

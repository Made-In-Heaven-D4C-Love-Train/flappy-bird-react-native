import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, AsyncStorage } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics'
import Icon from 'react-native-vector-icons/MaterialIcons';
export default function App() {
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [gameEngine, setGameEngine] = useState(null)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [bestScore, setBestScore] = useState(0)

  

  useEffect(() => {
    setRunning(false)
    setPaused(false)
    AsyncStorage.getItem('bestScore').then((value) => {
      if (value !== null) {
        setBestScore(parseInt(value))
      }
    })
  }, [])

  useEffect(() => {
    if (currentPoints > bestScore) {
      setBestScore(currentPoints)
      AsyncStorage.setItem('bestScore', `${currentPoints}`)
    }
  }, [currentPoints])

  const BackgroundImage = () => (
    <Image
      source={require('./assets/background.png')}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        resizeMode: 'cover'
      }}
    />
  );

  return (
    <View style={{flex: 1, backgroundColor: '#4eadf5'}}>
      <BackgroundImage />
      <Text style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold'}}>{currentPoints}</Text>
      <GameEngine
      ref={(ref) => { setGameEngine(ref) }}
      systems={[Physics]} 
      entities={entities()}
      running={running}
      onEvent={(e) => {
        switch(e.type){
          case 'game_over':
            setRunning(false)
            gameEngine.stop()
            break;
          case 'new_point':
            setCurrentPoints(currentPoints + 1)
            break;
        }
      }}
      style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
         <StatusBar style="auto" hidden={true} />
      </GameEngine>

      { !paused && running ? 
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, right: 20}}
    onPress = {() => {
      setPaused(true)
      gameEngine.stop()
    }}>
     <Icon name="pause" size={30} color="#fff" />

    </TouchableOpacity> : null }

    { paused ? 
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, right: 20}}
    onPress = {() => {
      setPaused(false)
      gameEngine.start()
    }}>
      <Icon name="play-arrow" size={30} color="#fff" />
    </TouchableOpacity> : null }


      { !running ? 
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity style={{backgroundColor: 'black', paddingHorizontal: 30, paddingVertical: 10}}
      onPress = {() => {
        setCurrentPoints(0)
        setRunning(true)
        gameEngine.swap(entities())
      }}>
        <Text style={{fontWeight: 'bold', color: 'white'}}>
          START GAME
        </Text>
      </TouchableOpacity>
      <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
        Best Score : {bestScore}
      </Text>
     </View> : null}
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

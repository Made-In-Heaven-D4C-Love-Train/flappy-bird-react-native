import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, AsyncStorage } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './entities';
import Physics from './physics'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import { Dimensions } from "react-native";
import { godMode, setGodMode } from './GodMode';
import Background from './components/Background';
//import { paused, setPaused } from './Pause';
export default function App() {
  const windowHeight = Dimensions.get('window').height
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [music, setMusic] = useState(true)
  const [gameEngine, setGameEngine] = useState(null)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [backgroundColor, setBackgroundColor] = useState('#4eadf5')
  const [opacity, setOpacity] = useState(0)
  const sound = new Audio.Sound();
  // const sound2 = new Audio.Sound();
  const [sound2, setSound2] = useState(null);
  const [sound3, setSound3] = useState(null);
  const [message, setMessage] = useState("")
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(null);
  const [response, setResponse] = useState(false);

  const loadSound = async () => {
    //const { sound2 } = await Audio.Sound.createAsync(require('./sounds/GIGACHAD-ONE-PUNCH-MAN.mp3'));
    const sound = new Audio.Sound();
    //sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await sound.loadAsync(require('./sounds/GIGACHAD-ONE-PUNCH-MAN(2).mp3'))
    setSound2(sound);
  };

  const loadGodMode =  async () => {
    const sound = new Audio.Sound();
    //sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    await sound.loadAsync(require('./sounds/MADE-IN-HEAVEN.mp3'));
    setSound3(sound);
  }

  const handleButtonPress = () => {
    const currentTime = new Date().getTime();
    
    if (clickCount === 0 || currentTime - lastClickTime > 10000) {
      setClickCount(1);
      setLastClickTime(currentTime);
    } else if (clickCount < 5) {
      setClickCount(clickCount + 1);
      setLastClickTime(currentTime);
    } else if (clickCount >= 5) {
      
      setClickCount(0);
      setLastClickTime(null);
      //console.log("yes")
      // Appeler la fonction ici
      callFunction();
    }
  };

  const callFunction = async () => {
    try {
     
        //console.log("espoir")
      // GOD MODE
      await sound3.playAsync();
      const test = await sound3.getStatusAsync()
      setResponse(test.isPlaying);
      //console.log(test.isPlaying)
      setMessage("God Mode Enabled")
      setGodMode(true)
      
      
      
      //console.log("God Mode Enabled")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setRunning(false)
    setPaused(false)
    //this.sound = new Audio.Sound();
    loadSound();
    loadGodMode();
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

   playSound = async  () => {
    try {
      if(response === false){
      pauseMusic();
      await sound.loadAsync(require('./sounds/ZA-WARUDO.mp3'));
      await sound.playAsync();
      const test = await sound.getStatusAsync()
      setResponse(test.isPlaying);
      //console.log(test.isPlaying)
      setTimeout(function() {
        setResponse(false);
      }, 5000);
      }
      //console.log("oui")
    } catch (error) {
      console.log(error);
    }
  };

  playMusic = async  () => {
    try {
      
      const testGodMode = await sound3.getStatusAsync()
        if(testGodMode.isPlaying === false){
          const status = await sound2.getStatusAsync();
          if (status.isLoaded) {
            await sound2.setIsLoopingAsync(true);
            await sound2.playAsync();
          }
        
      //console.log("play : "+ await sound2.getStatusAsync().isPlaying)
      //await sound2.pauseAsync();
      const test = await sound2.getStatusAsync()
      setResponse(false);
      //console.log(test.isPlaying)
        }
      // setTimeout(function() {
      //   setResponse(false);
      // }, 194000);
    
      //console.log("oui")
    } catch (error) {
      console.log("Erreur : "+error);
    }
  };

  const pauseMusic = async () => {
    try {
      
      const status = await sound2.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      
      await sound2.pauseAsync();
      
    }
    } catch (error) {
      console.log(error);
    }
  };

   const BackgroundImage = () => (
    <Image
      source={require('./assets/background-2.png')}
       style={{
         position: 'absolute',
         top: 0,
         left: 0,
         bottom: 0,
         right: 0,
         resizeMode: 'cover',
         
      }}
     />
   );

  return (
    <View style={{flex: 1, backgroundColor: {backgroundColor},
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20}}>
    <BackgroundImage />
    { running ?
      <Background paused={paused} setPaused={setPaused}/>
    : null}
      <Text style={{textAlign: 'center', position: 'absolute', top: 20, fontSize: 40, fontWeight: 'bold'}}>{currentPoints}</Text>
      
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
    {/* music-note  music-off */}
   
    { !music ? 
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, left: 20}}
    onPress = {() => {
      setMusic(true)
      {handleButtonPress()}
      {pauseMusic()}
      // {playMusic()}
      //console.log("desactive")
    }}>
      <Icon name="music-note" size={30} color="#fff" />
    </TouchableOpacity> : 

    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, left: 20}}
    onPress = {() => {
      setMusic(false)
      {handleButtonPress()}
      {playMusic()}
      //console.log("active")
    }}>
      <Icon name="music-off" size={30} color="#fff" />
    </TouchableOpacity>

    }
  { !music && !paused && running ?
  // <View style={{flex: 1, backgroundColor: 'black', opacity: 0.7}}>
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, right: 20}}
      onPress = {() => {
        setPaused(true)
        gameEngine.stop()
        {playSound()}

      }}>
      <Icon name="pause" size={30} color="#fff" />
    </TouchableOpacity>
  // </View>
  : null}

{ !music && paused && running ? 
    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 30, paddingHorizontal: 10, paddingVertical: 10, position: 'absolute', top: 20, right: 20}}
    onPress = {() => {
      setPaused(false)
      gameEngine.start()
      {playMusic()}
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
     
     <Text style={{position: 'absolute', bottom: 0, textAlign: 'center', fontWeight: 'bold', fontSize: 20, fontFamily: 'Roboto', color: 'white'}}>{message}</Text>
     
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

import {useState, useRef, useEffect, useContext } from 'react'
import { View, Image, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StatsContext } from './Context.jsx'
import DiceRoller from './DiceRoller.jsx'
import RollBtn from './RollBtn.jsx'
import Board from './Board.jsx'
import Winner from './Winner.jsx'
import ScoreBoard from './ScoreBoard.jsx'
import Login from './Login.jsx'
import Confirm from './Confirm.jsx'
import Tutorial from './Tutorial.jsx'
import LeaderBoard from './LeaderBoard.jsx'
import helpIcon from '../assets/help.png'
import RestartIMG from "../assets/restart.svg"
import { StatusBar } from 'react-native'

import card_cover from '../assets/card_cover-Yatzy.svg';
import AsyncStorage from '@react-native-async-storage/async-storage'

function Game(){
    const {playerStats, updatePlayerStats, playerNames} = useContext(StatsContext);
    const isplayer1Ref = useRef(true);
    const [isplayer1, setisplayer1] = useState(true);
    const [dicesProps, setDicesProps] = useState([
        {saved: false, src: card_cover},
        {saved: false, src: card_cover},
        {saved: false, src: card_cover},
        {saved: false, src: card_cover},
        {saved: false, src: card_cover},
    ]
    );
    const [viewPage, setViewPage] = useState({
        tutorial: !true,
        login: true,
        winner: !true,
        confirm: !true,
        leaderboard: !true
    }) 
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [hasRestarted, setHasRestarted] = useState(false);

    const [dice_indexes, set_dice_indexes] = useState([]);
    const [clickCount, setClickCount] = useState(0); 
    const dice_starting_index = useRef(0);

    const [disableButton, setDisableButton] = useState({rollBtn: false, playBtn: true})
    const [playTriggered, setPlayTriggered] = useState(false);
    const bonusPoints = useRef({p1: 0, p2: 0});
    const finalTotalRef = useRef({p1: 0, p2: 0})

    const [winner_name, set_winner_name] = useState();
    const [wasWon, setWasWon] = useState();
    const hasFinished = useRef(true); 
    const [confirm_message, set_confirm_message] = useState({
        reason: '',
        index: null,
        message: '',
    })


    const triggerRoll = ()=>{
        const new_count = clickCount + 1
        if (clickCount >= 2) {
            setDisableButton(prev => ({...prev, rollBtn: true}));
        }
        dice_starting_index.current = 0
        
        setDisableButton(prev => ({...prev, playBtn: true}));
        setClickCount(c => c + 1)

        return new_count
    }
    
    const toggleDice = (index) => {
        setDicesProps(prev => {
            const copy = [...prev];
            copy[index] = {
                ...copy[index],
                saved: !copy[index].saved
            };
            return copy;
        });
    }

    const reset_game = () =>{
        setClickCount(0);
        setDicesProps([
            {saved: false, src: card_cover},
            {saved: false, src: card_cover},
            {saved: false, src: card_cover},
            {saved: false, src: card_cover},
            {saved: false, src: card_cover},
        ])
        set_dice_indexes([])
        setDisableButton({rollBtn: false, playBtn: true});
    }

    const handle_play = () =>{
        reset_game()
        isplayer1Ref.current = !isplayer1Ref.current;
        setisplayer1(isplayer1Ref.current)

        setPlayTriggered(prev => prev + 1)
    }

    const getTotalScore = async ({p1: score1, p2: score2}) =>{
        const num_of_left_dice = 6
        bonusPoints.current.p1 = 0
        bonusPoints.current.p2 = 0
        for (let i = 0; i < num_of_left_dice; i++) {
            const total1 = score1[i].score;
            const total2 = score2[i].score;
            if(total1 >= 0){
                bonusPoints.current.p1 += total1;
            }
            if(total2 >= 0){
                bonusPoints.current.p2 += total2;
            }
        }
        bonusPoints.current.p1 >= 63 ? finalTotalRef.current.p1 = 35 : finalTotalRef.current.p1 = 0
        bonusPoints.current.p2 >= 63 ? finalTotalRef.current.p2 = 35 : finalTotalRef.current.p2 = 0
        
        for (let i = 0; i < score1.length; i++) {
            const element1 = score1[i];
            const element2 = score2[i];
            if(element1.isPlayed){
                finalTotalRef.current.p1 += element1.score;
            }
            if(element2.isPlayed){
                finalTotalRef.current.p2 += element2.score;
            }
        }    
        
        hasFinished.current = true
        
        for (let i = 0; i < score1.length; i++) {
            const element1 = score1[i];
            const element2 = score2[i];
            if(!element1.isPlayed || !element2.isPlayed){
                hasFinished.current = false;
                break
            }

        }

        if (hasFinished.current) {
            await getWinner(finalTotalRef)
        }
    }

    const getWinner = async (finalTotalRef) => {
        setViewPage(prev => ({...prev, winner: true}))
        if(finalTotalRef.current.p1 > finalTotalRef.current.p2){
            set_winner_name(playerNames.p1 ? playerNames.p1 : 'Square')
            playerNames.p1 ? updateOutcome(playerNames.p1, "wins", finalTotalRef.current.p1) : null
            playerNames.p2 ? updateOutcome(playerNames.p2, "losses", finalTotalRef.current.p2) : null
            setWasWon(true)
        }
        else if(finalTotalRef.current.p1 < finalTotalRef.current.p2){
            set_winner_name(playerNames.p2 ? playerNames.p2 : 'Circle')
            playerNames.p1 ? updateOutcome(playerNames.p1, "losses", finalTotalRef.current.p1) : null
            playerNames.p2 ? updateOutcome(playerNames.p2, "wins", finalTotalRef.current.p2) : null
            setWasWon(true)
        }
        else{
            set_winner_name('')
            playerNames.p1 ? updateOutcome(playerNames.p1, "draws", finalTotalRef.current.p1) : null
            playerNames.p2 ? updateOutcome(playerNames.p2, "draws", finalTotalRef.current.p2) : null
            setWasWon(false)
        }
        setDisableButton(prev => ({...prev, rollBtn: true}));
        setHasUnsavedChanges(false)
    }
    
    const toggleRestart = () => {
        setHasRestarted(false)
    }

    const confirm_response = () =>{
        if(confirm_message.reason == 'restart'){
            reset_game()
            isplayer1Ref.current = true;
            setisplayer1(isplayer1Ref.current)
            setHasUnsavedChanges(false)
            setHasRestarted(true)
            setViewPage(prev => ({...prev, login: true}))
        }else if(confirm_message.reason == 'delete'){
            updatePlayerStats(prev => {
                let copy = [...prev];
                copy = copy.filter((_, i) => i != confirm_message.index)
                AsyncStorage.setItem('yatzy_stats', JSON.stringify(copy))
                return copy
            })
        }
    }

    const restartGame = () =>{
        if(hasUnsavedChanges){
            set_confirm_message({reason: 'restart', message: "Are you sure you want to restart?"})
            setViewPage(prev => ({...prev, confirm: true}))
        }
        else{
            setViewPage(prev => ({...prev, winner: false, login: true}))
            setDisableButton(prev => ({...prev, rollBtn: false}));
            setHasRestarted(true)
        }
    }

    const getStats = () => {
        setViewPage(prev => ({...prev, login: false}))
        setHasUnsavedChanges(true)
    }

    useEffect(()=>{
        getStats()
    }, [])

    const updateOutcome = (name, outcome, score) => {
        for (let i = 0; i < playerStats.length; i++) {
            if((name.toLowerCase() == playerStats[i].name.toLowerCase())){
                updatePlayerStats( prev => {
                    let copy = [...prev];
                    let {avg_points, wins, draws, losses, highest_points} = copy[i];
                    let num_of_games = wins + losses + draws

                    copy[i][outcome]++;
                    copy[i].avg_points = (((avg_points * num_of_games) + score) / (num_of_games + 1))
                    
                    if (score > highest_points){
                        copy[i].highest_points = score
                    }
                    AsyncStorage.setItem('yatzy_stats', JSON.stringify(copy))
                    return copy
                })
            }
        }
    }

    const removeTutorial = ()=>{
        setViewPage(prev => ({...prev, tutorial: false}))
    }
    
    const insets = useSafeAreaInsets();
    
    return(<>
        <StatusBar/>
        <View style={[{paddingTop: (insets.top)}, styles.wrapper]}>
            <Login getStats={getStats} viewLoginPage={viewPage.login}/>
            <Tutorial wasClicked={viewPage.tutorial} removeTutorial={removeTutorial}/>
            <Winner setViewPage={setViewPage} viewWinnerPage={viewPage.winner} winner_name={winner_name} wasWon={wasWon} restartGame={restartGame}/>
            <LeaderBoard wasClicked={viewPage.leaderboard} setViewPage={setViewPage} set_confirm_message={set_confirm_message}/>
            <Confirm viewPage={viewPage.confirm} message={confirm_message.message} response={confirm_response} setViewPage={setViewPage} />

            <Pressable style={({pressed}) => ([pressed && styles.IconHoverImg])} onPress={restartGame}>
                <RestartIMG style={styles.restart_current} width={40} height={40}/>
            </Pressable>
            
            <Pressable title='How to play' style={({pressed}) => ([pressed && styles.IconHoverImg])} onPress={() => setViewPage(prev => ({...prev, tutorial: true}))}>
                <Image source={helpIcon} style={styles.helpIcon} alt='How to play'/>
            </Pressable>

            <ScoreBoard scores={finalTotalRef.current}/>
            <Board toggleRestart={toggleRestart} playTriggered={playTriggered} activeBoxP1={isplayer1} triggerRoll={clickCount} dice_indexes={dice_indexes} disable_playBtn={setDisableButton} getTotalScore={getTotalScore} hasRestarted={hasRestarted}/>
            <DiceRoller active={isplayer1} set_dice_indexes={set_dice_indexes} numOfRolls={clickCount} dice_starting_index={dice_starting_index.current} disable_rollBtn={setDisableButton} dicesProps={dicesProps} setDicesProps={setDicesProps} toggleDice={toggleDice}/>
            <RollBtn clickCount={clickCount} setClickCount={setClickCount} triggerRoll={triggerRoll} handle_play={handle_play} disableRoll={disableButton.rollBtn} disablePlay={disableButton.playBtn} playerTurn={isplayer1}/>
        </View>
    </>)
}

export default Game;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'lightsalmon',
        flex: 1,
        // padding: 8,
        position: 'relative'
    },
    helpIcon: {
        position: 'absolute',
        zIndex: 100,
        top: 15,
        left: '92%',
        transform: [{ translateX: '-50%' }],
        height: 50,
        width: 50,
		resizeMode: 'contain',
        opacity: 0.8,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3
    },
    IconHoverImg: {
        opacity: .5,
    },
    restart_current: {
        position: 'absolute',
        zIndex: 10,
        top: 20,
        left: '8%',
        transform: [{ translateX: '-50%' }],
        height: 40,
        opacity: 0.8,
    },
})
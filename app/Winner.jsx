import { Pressable, StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native'
import IMG from "../assets/restart.svg"
import LeaderBoardIMG from '../assets/leaderboard.svg'
import OuterShell from './OuterShell'
import {useState, useEffect, useContext} from "react"
import { StatsContext } from './Context'

function Winner({viewWinnerPage, winner_name, wasWon, restartGame, setViewPage}){
    let { width, height } = useWindowDimensions()
    width = (width < 400 ? width : 300)

	const styles = imageStyling(width, height)
    const [showStats, setShowStats] = useState({p1: true, p2: true})
    const {playerStats, playerNames} = useContext(StatsContext)

    const format_name = (name) => {
        if (name) return (name.charAt(name.length-1).toLowerCase() != 's' ? `${name}'s` : `${name}'`)
    } 

    useEffect(()=>{
        setShowStats(prev => ({p1: {show: false, index: 0}, p2: {show: false, index: 0}}))
    }, [restartGame])

    useEffect(() =>{
        for (let i = 0; i < playerStats.length; i++) {
            if(playerNames.p1.toLowerCase() == playerStats[i].name.toLowerCase()){
                setShowStats(prev => {
                    let copy = {...prev};
                    copy.p1.index = i;
                    return copy
                })
            }
            if(playerNames.p2.toLowerCase() == playerStats[i].name.toLowerCase()){
                setShowStats(prev => {
                    let copy = {...prev};
                    copy.p2.index = i;
                    return copy
                })
            }
        }
    }, [playerStats])

    return(<>
        {viewWinnerPage && (
        <OuterShell>
            <View style={styles.winnerSection}>
                <Text style={styles.winnerSectionH3}>{wasWon ? "Winner" : "Draw"}</Text>
                <Pressable style={styles.restartGame} title="Restart" onPress={restartGame}>
                    <IMG style={styles.restartImg} width={30} height={30}/> 
                </Pressable>
                <Pressable style={styles.showLeaderBoard} onPress={() => setViewPage(prev => ({...prev, leaderboard: true}))}>
                    <LeaderBoardIMG width={50} height={50} style={styles.LeaderBoardIMG}/>
                </Pressable>
                <Text style={styles.winner_name_display}>{winner_name}</Text>
                
                <View style={styles.statsContainer}>
                    {playerNames.p1 && <View>
                        <Pressable style={[styles.view_stats_btn, {backgroundColor: "yellow"}]} 
                            onPress={() => setShowStats(prev => {
                                let copy = {...prev};
                                copy.p1.show = !copy.p1.show 
                                return copy
                            })}>
                            <Text style={styles.view_stats_btn_text} ellipsizeMode='tail' numberOfLines={1}>View {format_name(playerNames.p1)} Stats</Text>
                        </Pressable>
                        {showStats.p1.show && ( 
                            <View style={styles.view_main_stats}>
                                <View>
                                    <View style={styles.statsContainerTr}>
                                        <Text style={styles.statsContainerTh}>Wins:</Text>
                                        <Text style={styles.statsContainerTd} numberOfLines={1}>{playerStats[showStats.p1.index]['wins']}</Text>
                                    </View>
                                    <View style={styles.statsContainerTr}>
                                        <Text style={styles.statsContainerTh}>Draws:</Text>
                                        <Text style={styles.statsContainerTd} numberOfLines={1}>{playerStats[showStats.p1.index]['draws']}</Text>
                                    </View>
                                    <View style={styles.statsContainerTr}>
                                        <Text style={styles.statsContainerTh}>Losses:</Text>
                                        <Text style={styles.statsContainerTd} numberOfLines={1}>{playerStats[showStats.p1.index]['losses']}</Text>
                                    </View>
                                    <View style={styles.statsContainerTr}>
                                        <Text style={styles.statsContainerTh}>Avg Pts:</Text>
                                        <Text style={styles.statsContainerTd} numberOfLines={1}>{playerStats[showStats.p1.index]['avg_points'].toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.statsContainerTr}>
                                        <Text style={styles.statsContainerTh}>Best Score:</Text>
                                        <Text style={styles.statsContainerTd} numberOfLines={1}>{playerStats[showStats.p1.index]['highest_points']}</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>}
            
                    {playerNames.p2 && <View>
                        <Pressable style={[styles.view_stats_btn, {backgroundColor: "springgreen"}]} 
                            onPress={() => setShowStats(prev => {
                                let copy = {...prev};
                                copy.p2.show = !copy.p2.show 
                                return copy
                            })}>
                            <Text style={styles.view_stats_btn_text}>View {format_name(playerNames.p2)} Stats</Text>
                        </Pressable>
                        {showStats.p2.show && (
                        <View style={styles.view_main_stats}>
                            <View>
                                <View style={styles.statsContainerTr}>
                                    <Text style={styles.statsContainerTh}>Wins:</Text>
                                    <Text style={[styles.statsContainerTd, {color: "springgreen"}]} numberOfLines={1}>{playerStats[showStats.p2.index]['wins']}</Text>
                                </View>
                                <View style={styles.statsContainerTr}>
                                    <Text style={styles.statsContainerTh}>Draws:</Text>
                                    <Text style={[styles.statsContainerTd, {color: "springgreen"}]} numberOfLines={1}>{playerStats[showStats.p2.index]['draws']}</Text>
                                </View>
                                <View style={styles.statsContainerTr}>
                                    <Text style={styles.statsContainerTh}>Losses:</Text>
                                    <Text style={[styles.statsContainerTd, {color: "springgreen"}]} numberOfLines={1}>{playerStats[showStats.p2.index]['losses']}</Text>
                                </View>
                                <View style={styles.statsContainerTr}>
                                    <Text style={styles.statsContainerTh}>Avg Pts:</Text>
                                    <Text style={[styles.statsContainerTd, {color: "springgreen"}]} numberOfLines={1}>{playerStats[showStats.p2.index]['avg_points'].toFixed(2)}</Text>
                                </View>
                                <View style={styles.statsContainerTr}>
                                    <Text style={styles.statsContainerTh}>Best Score:</Text>
                                    <Text style={[styles.statsContainerTd, {color: "springgreen"}]} numberOfLines={1}>{playerStats[showStats.p2.index]['highest_points']}</Text>
                                </View>
                            </View>
                        </View>
                        )}
                    </View>}
                </View>
            </View>
        </OuterShell>
        )}
    </>)
}

export default Winner

const imageStyling = (width, height) => {
    return(
        StyleSheet.create({
            winnerSection: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                backgroundColor: 'brown',
                width: '100%',
                minHeight: 240,
                padding: 32,
                borderRadius: 8,
                opacity: 0.95,
                overflow: 'hidden',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            },
            winnerSectionH3: {
                fontSize: 19.2,
                color: 'wheat',
                marginBottom: 8
            },
            winner_name_display: {
                fontSize: 48,
                color: 'yellow',
                fontFamily: 'cursive',
                textTransform: 'uppercase'
            },
            restartGame: {
                top: 32,
                right: 16,
                position: 'absolute',
                borderWidth: 0,
                borderRadius: 11.2,
                backgroundColor: 'transparent',
                paddingVertical: 8,
                paddingHorizontal: 8
            },
            showLeaderBoard:{
                top: 32,
                left: 16,
                position: 'absolute',
                backgroundColor: 'transparent',
                paddingVertical: 8,
                paddingHorizontal: 8,
                width: 50,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center'
            },
            LeaderBoardIMG: {
                resizeMode: 'contain'
            },
            restartGameHover: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 3,
                transform: [{ scale: 1.1 }]
            },
            restartGameActive: {
                transform: [{ scale: 1 }]
            },
            statsContainer: {
                flexDirection: 'row',
                gap: 10,
                alignItems: 'flex-start',
                marginTop: 32,
                padding: 10,
                overflow: 'hidden'
            },
            statsContainerTr:{
                flexDirection: 'column',
                justifyContent: 'flex-start'
            },
            statsContainerTh: {
                paddingRight: 16,
                color: 'wheat'
            },
            statsContainerTd: {
                color: 'greenyellow',
                maxWidth: 112
            },
            view_stats_btn: {
                paddingVertical: 8,
                paddingHorizontal: 10,
                backgroundColor: '#4CAF50',
                borderWidth: 0,
                borderRadius: 4,
                maxWidth: (width / 2.2)
            },
            view_stats_btn_text:{
                color: 'rgb(153, 55, 38)',
                fontSize: 12.8,
                fontWeight: 'bold',
                textAlign: 'center'
            },
            view_main_stats: {
                marginTop: 16,
                fontSize: 16,
                backgroundColor: 'rgb(153, 55, 38)',
                padding: 16,
                fontFamily: 'monospace',
                width: (width / 2.5)
            }
        })
    )
}
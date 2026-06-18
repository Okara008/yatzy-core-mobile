import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useContext } from 'react'
import { StatsContext } from './Context'

const ScoreBoard = ({ scores }) => {
	let { width } = useWindowDimensions()
	width = (width < 400 ? width : 300)
	const styles = imageStyling(width)
	const {playerNames} = useContext(StatsContext)

	return (<>
		<View style={styles.headerAfter}></View>
		<View style={styles.header}>
			<View style={styles.playerScores}>
				<Text style={[styles.name, {color: 'yellow'}]} numberOfLines={1} ellipsizeMode='2ail'>
					{playerNames.p1 ? playerNames.p1:  'Square'}
				</Text>
				<Text style={[styles.score, {color: 'yellow'}]}>{scores.p1}</Text>
			</View>
			<Text style={styles.versus}>VS</Text>
			<View style={styles.playerScores}>
				<Text style={[styles.name, {color: 'springgreen'}]} numberOfLines={1} ellipsizeMode='tail'>
					{playerNames.p2 ? playerNames.p2:  'Circle'}
				</Text>
				<Text style={[styles.score, {color: 'springgreen'}]}>{scores.p2}</Text>
			</View>
		</View>
	</>)
}

export default ScoreBoard

const imageStyling = (width) => {
	return(
		StyleSheet.create({
			header: {
				backgroundColor: 'rgb(153, 55, 38)',
				borderRadius: 8,
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				paddingVertical: 8,
				paddingHorizontal: 32,
				gap: 20,
				alignSelf: 'center',
				position: 'relative'
			},
			headerAfter: {
				marginTop: 5,
				width: 75,
				height: 10,
				borderRadius: 4,
				borderBottomEndRadius: 0,
				borderBottomStartRadius: 0,
				backgroundColor: 'rgb(153, 55, 38)',
				// position: 'absolute',
				// top: -10,
				alignSelf: 'center'
			},	
			playerScores: {
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center'
			},
			name: {
				textTransform: 'uppercase',
				fontFamily: 'monospace',
				fontSize: 10,                
				maxWidth: 90,
			},
			score: {
				textTransform: 'uppercase',
				fontFamily: 'monospace',
				fontSize: 15
			},
			versus: {
				fontWeight: 'bold',
				fontSize: 17,
				color: 'white',
			}
		})
	)
}
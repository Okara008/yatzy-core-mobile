import { StyleSheet, Text, View, FlatList, Pressable, useWindowDimensions, Image } from 'react-native'
import { useEffect, useContext, useState } from 'react'
import { StatsContext } from './Context'
import x_button from '../assets/x_icon.png'
import delete_icon from '../assets/delete.png'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Tutorial = ({wasClicked, setViewPage, set_confirm_message}) => {
	let { width, height } = useWindowDimensions()
	width = (width < 400 ? width : 300)
	const styles = imageStyling(width, height)
    const {playerStats, updatePlayerStats, playerName} = useContext(StatsContext);

	useEffect(() => {
		updatePlayerStats(prev => {
			let copy = [...prev]
			for (let i = 0; i < (copy.length-1); i++) {
				for (let j = 0; j < (copy.length-1); j++) {
					if(copy[j].avg_points < copy[j+1].avg_points){
						let temp = copy[j];
						copy[j] = copy[j+1];
						copy[j+1] = temp
					}
				}
			}
			return copy
		})
	}, [wasClicked])

	const deleteRecord = (index) =>{
		set_confirm_message({reason: 'delete', index: index, message: "Are you sure you want to delete this user?"})
		setViewPage(prev => ({...prev, confirm: true}))
	}
	
    return(<>
        {wasClicked && ( 
            <View style={styles.outerShell}>
                <View style={[styles.table]}>
					<Pressable style={({pressed}) => ([pressed && styles.buttonHover, styles.x_button])} onPress={() => {
						setViewPage(prev => ({...prev, leaderboard: false}));
					}}> 
						<Image source={x_button} style={{height: 35, resizeMode: 'contain'}} />
					</Pressable>

					<Text style={styles.title}>LeaderBoard</Text>
					<View style={[{marginHorizontal: 15}, styles.row, styles.header]}>
						<Text  style={[styles.cell, styles.textHeading]}>S/N</Text>
						<Text  style={[styles.cell, styles.textHeading]}>Name</Text>
						<Text style={[ styles.cell, styles.textHeading]}>W-D-L</Text>
						<Text style={[ styles.cell, styles.textHeading]} numberOfLines={1}>PPG</Text>
						<Text style={[ styles.cell, styles.textHeading]}>Best</Text>
					</View>
					<FlatList
						data={playerStats}
						keyExtractor={(_, index) => index.toString()}
						contentContainerStyle={styles.tableData}
						renderItem={({item, index}) => (
							<View style={[styles.row]}>
								<View style={[styles.cell, {position: 'relative'}]}>
									<Text>{index+1}</Text>
									<Pressable onPress={() => deleteRecord(index)} style={({pressed}) => ([styles.delete_btn, pressed && styles.buttonHover])}>
										<Image source={delete_icon} style={styles.delete_icon}/>
									</Pressable>
								</View>
								<Text numberOfLines={1} style={styles.cell}>{item.name}</Text>
								<Text style={[ styles.cell,]}>{item.wins}-{item.draws}-{item.losses}</Text>
								<Text style={[ styles.cell,]}>{item.avg_points.toFixed(2)}</Text>
								<Text style={ styles.cell}>{item.highest_points}</Text>
							</View>
						)}
					/>
                </View>
            </View>
        )}
    </>)
}

export default Tutorial

const imageStyling = (width, height) => {
	return (
		StyleSheet.create({
			outerShell: {
				position: 'absolute',
				zIndex: 998,
				top: 0,
				left: 0,
				alignItems: 'center',
				justifyContent: 'center',
				alignSelf: 'center',
				flexDirection: 'column',
				height: height,
				width: '100%',
				backgroundColor: 'rgba(0, 0, 0, 0.6)'
			},
			title:{
				textAlign:'center',
				fontSize: 25,
				color: 'white',
				marginBottom: 20,
				textTransform: 'uppercase'
			},
			table: {
				position: 'relative',
				width: 800,
				maxWidth: '100%',
				minHeight: 320,
				maxHeight: height,
				paddingVertical: 48,
				paddingHorizontal: 0,
				backgroundColor: 'rgb(153, 55, 38)',
				// borderWidth: 1,
			},
			textHeading:{
				borderBlockWidth: 0,
				fontWeight: 'bold',
				fontSize: width / 25,
			},
			tableData:{
				backgroundColor: 'wheat', 
				borderRadius: 3, 
				marginHorizontal: 15
			},
			row: {
				flexDirection: 'row',
				textTransform: 'capitalize'
			},
			header: {
				backgroundColor: '#ddd',
			},
			cell: {
				flex: 1,
				borderWidth: .4,
				padding: 8,
				textAlign: 'left',
				fontSize: width / 30,
				textTransform: 'capitalize',
				verticalAlign: 'bottom',
			},
			x_button: {
				position: 'absolute',
				right: '10%',
				top: '10%',
				transform: [{ translateX: '50%' }, { translateY: '-50%' }],
				zIndex: 10,
				alignItems: 'center',
				justifyContent: 'center',
				width: 40,
				overflow: 'hidden'
			},
			buttonHover: {
				opacity: 0.5
			},
			delete_btn:{
				position: 'absolute',
				top: '50%',
				right: 0,
				// transform: [{translateY: '-50%'}]
			},
			delete_icon:{
				width: width / 30,
				height: width / 20,

				resizeMode: 'cover',
			},	
		})
	)
}
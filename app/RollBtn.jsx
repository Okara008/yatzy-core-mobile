import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'

const RollBtn = ({clickCount, setClickCount, triggerRoll, disableRoll, disablePlay, handle_play, playerTurn}) => {
	let { width } = useWindowDimensions()
	width = (width < 400 ? width : 350)
	const styles = imageStyling(width)

	return (
		<View style={styles.footer}>
			<Pressable onPress={() => setClickCount(triggerRoll())} style={({pressed}) => ([styles.btnRoll,  pressed && styles.btnRollHover, disableRoll && styles.btnRollDisabled])} disabled={disableRoll}>
				<View style={[styles[(playerTurn ? "playerSquare" : "playerCircle")], styles.playerShapes]}></View>
				<Text style={[styles.btnText, {marginHorizontal: 5, fontSize: 20}]}>Roll</Text>
				<Text style={[styles.clickCount, (clickCount >= 1) && styles.clickCountDisable]}>1</Text>
				<Text style={[styles.clickCount, (clickCount >= 2) && styles.clickCountDisable]}>2</Text>
				<Text style={[styles.clickCount, (clickCount >= 3) && styles.clickCountDisable]}>3</Text>
			</Pressable>

			<Pressable onPress={handle_play} style={({pressed}) => ([styles.btnPlay, pressed && styles.btnPlayHover, disablePlay && styles.btnPlayDisabled])} disabled={disablePlay}>
				<Text numberOfLines={1} style={styles.btnText}>play</Text>
			</Pressable>
		</View>
	)
}

export default RollBtn

const imageStyling = (width) => {
	return(
		StyleSheet.create({
			footer: {
				marginVertical: 10,
				gap: 10,
				width: width,
				flexDirection: 'row',
				justifyContent: 'center',
				alignSelf: 'center'
			},
			btnRoll: {
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				gap: 5,
				backgroundColor: 'rgb(153, 55, 38)',
				paddingVertical: 10,
				paddingHorizontal: 20,
				borderRadius: 16,
				borderWidth: 4,
				borderColor: 'rgb(65, 5, 5)',
				width: (width * .6)
			},
			btnRollDisabled: {
				backgroundColor: 'gray',
				borderColor: 'black'
			},
			btnRollHover: {
				backgroundColor: 'rgba(153, 55, 38, 0.8)'
			},
			btnPlay: {
				borderRadius: 16,
				paddingVertical: 10,
				paddingHorizontal: 20,
				backgroundColor: 'green',
				borderWidth: 4,
				borderColor: 'rgb(3, 39, 3)',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				width: width * .3
			},
			btnText: {
				color: 'white',
				textTransform: 'uppercase',
				fontFamily: 'Verdana',
				fontSize: 15,
				fontWeight: 900
			},
			btnPlayDisabled: {
				backgroundColor: 'gray',
				borderColor: 'black'
			},
			btnPlayHover: {
				backgroundColor: 'rgba(0, 128, 0, 0.8)'
			},
			clickCount: {
				borderWidth: 2,
				borderColor: 'black',
				width: (width / 15),
				height: (width / 15),
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'white',
				fontFamily: 'monospace',
				textAlign: 'center',
				verticalAlign: 'middle',
				fontWeight: 'bold',
				fontSize: 10,
				borderRadius: 8
			},
			clickCountDisable: {
				backgroundColor: 'rgba(255, 255, 255, 0.4)',
				borderColor: 'transparent'
			},
			playerCircle: {
				backgroundColor: 'green',
				borderRadius: 12
			},
			playerSquare: {
				backgroundColor: 'yellow',
				borderRadius: 4.8
			},
			playerShapes:{
				shadowColor: '#000',
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowOpacity: 1,
				shadowRadius: 5,
				// Android
				elevation: 10,
				
				width: 20,
				height: 20,
			}
		})
	)
}
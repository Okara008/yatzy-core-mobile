import { StyleSheet, Text, View, Image, Pressable, useWindowDimensions } from 'react-native'
import tutorial_roll from '../assets/tutorial_roll.png'
import tutorial_confirm_score from '../assets/tutorial_confirm_score.png'
import tutorial_lock_dice from '../assets/tutorial_lock_dice.png'
import tutorial_score_board from '../assets/tutorial_score_board.png'
import tutorial_tool_tip from '../assets/tutorial_tool_tip.png'
import tutorial_play_btn from '../assets/tutorial_play_btn.png'
import tutorial_bonus from '../assets/tutorial_bonus.png'
import x_button from '../assets/x_icon.png'
import { useEffect, useRef, useState } from 'react'

const Tutorial = ({wasClicked, removeTutorial}) => {
	const { height } = useWindowDimensions()
	const styles = imageStyling(height)

	const tutorial_display_ref = useRef([
        {img: tutorial_roll, info: "Hit the Roll button to play → You can roll up to 3 times on your turn."},
        {img: tutorial_lock_dice, info: "Tap dice to lock them → locked dice won't change on next roll."},
        {img: "", info: "No need to use all three rolls. Stop early if you're satisfied with your dice!"},
        {img: "", info: "Each box on the board is a different scoring category. Ones, Twos, Threes, Four, Fives, Sixes — plus special combinations like '3 of a kind' and 'Full House'."},
        {img: tutorial_tool_tip, info: "Hover over / tap each scoring box to learn how points are calculated."},
        {img: tutorial_confirm_score, info: "Tap the box with your color to preview your points"},
        {img: tutorial_play_btn, info: "Hit PLAY to record your score."},
        {img: tutorial_bonus, info: "If your left section total (1s to 6s) reaches 63 points, you earn a 35-points bonus."},
        {img: "", info: "Once you record a score in a box, you cannot use it again. Choose wisely!"},
        {img: tutorial_score_board, info: "Your total score appears here on the scoreboard."},
        {img: "", info: "After every cell is played, a winner is announced. If scores are tied, it's a draw."},
    ]) 
    const [tutorial_display] = useState([...tutorial_display_ref.current])
    const [disable_btn, set_disable_btn] = useState({prev: true, next: false})
    const index_of_display_ref = useRef(0)
    const [index_of_display, set_index_of_display] = useState(index_of_display_ref.current)

    const update_index = (num) => {
        index_of_display_ref.current += num
        set_index_of_display(index_of_display_ref.current)
        set_disable_btn(pre => ({...pre, next: (index_of_display_ref.current === (tutorial_display_ref.current.length - 1) ? true : false)}))
        set_disable_btn(pre => ({...pre, prev: (index_of_display_ref.current === (0) ? true : false)}))
    }
    
    useEffect(() => {
        index_of_display_ref.current = 0
        set_index_of_display(index_of_display_ref.current)
        set_disable_btn({prev: true, next: false})
    }, [wasClicked])
    

    return(<>
        {wasClicked && ( 
            <View style={styles.outerShell}>
                <View style={styles.tutorialSection}>
                    <Pressable style={({pressed}) => ([pressed && styles.x_buttonHover, styles.x_button])} onPress={removeTutorial}> 
						<Image source={x_button} alt="x" style={{height: 35, resizeMode: 'contain'}} />
					</Pressable>
                    <View style={styles.tutorial_img_display}>
                        <Text style={styles.page_num}>{index_of_display + 1}</Text>
                        { tutorial_display[index_of_display].img &&
                            (<Image source={tutorial_display[index_of_display].img} alt="Tutorial Image" style={styles.display_img}/>)
                        }
                        <Text style={styles.tutorial_info}>{tutorial_display[index_of_display].info}</Text>
                    </View>
                    <View style={styles.tutorial_btns}>
                        <Pressable disabled={disable_btn.prev} style={({pressed}) =>  ([styles.tutorial_Previous, styles.tutorial_btns_button, disable_btn.prev && styles.btn_disabled, pressed && styles.tutorial_PreviousHover, ])} onPress={() => update_index(-1)}>
							<Text>Previous</Text>
						</Pressable>
                        <Pressable disabled={disable_btn.next} style={({pressed}) =>  ([styles.tutorial_Next, styles.tutorial_btns_button, disable_btn.next && styles.btn_disabled, pressed && styles.tutorial_NextHover, ])} onPress={() => update_index(1)}>
							<Text>Next</Text>
						</Pressable>
                    </View>
                </View>
            </View>
        )}
    </>)
}

export default Tutorial

const imageStyling = (height) => {
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
			tutorialSection: {
				position: 'relative',
				width: 800,
				maxWidth: '100%',
				minHeight: 320,
				paddingVertical: 48,
				paddingHorizontal: 0,
				backgroundColor: 'rgb(153, 55, 38)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				gap: 32
			},
			tutorial_img_display: {
				width: '70%',
				// minWidth: 300,
				maxHeight: 250,
				padding: 24,
				backgroundColor: '#ffa07a',
				borderRadius: 32,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				gap: 16,
				position: 'relative'
			},
			page_num: {
				position: 'absolute',
				top: 8,
				backgroundColor: 'rgb(75, 24, 15)',
				borderRadius: 100,
				width: 16,
				height: 16,
				display: 'flex',
				textAlign: 'center',
				fontSize: 10,
				alignItems: 'center',
				justifyContent: 'center',
				color: '#ffa07a'
			},
			display_img: {
				width: '100%',
				maxHeight: 100,
				resizeMode: 'contain',
			},
			tutorial_info: {
				borderBottomWidth: 3.2,
				borderBottomColor: '#ffa07a',
				color: 'black',
				fontWeight: 'bold',
				fontFamily: 'monospace',
				textTransform: 'capitalize',
				textAlign: 'center'
			},
			tutorial_btns: {
				width: '70%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 32,
				flexDirection: 'row'
			},
			tutorial_btns_button: {
				width: '40%',
				borderRadius: 9.6,
				borderWidth: 0,
				paddingVertical: 8,
				paddingHorizontal: 8,
				alignItems: 'center',
				justifyContent: 'center',
				fontSize: 14.4
			},
			tutorial_Next: {
				backgroundColor: '#4CAF50'
			},
			tutorial_NextHover: {
				backgroundColor: '#4caf4fc0'
			},
			tutorial_Previous: {
				backgroundColor: '#e0e0e0'
			},
			tutorial_PreviousHover: {
				backgroundColor: '#e0e0e0d2'
			},
			btn_disabled: {
				opacity: .4
			},
			x_button: {
				position: 'absolute',
				right: '10%',
				top: '10%',
				transform: [{ translateX: '50%' }, { translateY: '-50%' }],
				zIndex: 10,
			},
			x_buttonHover: {
				opacity: 0.7
			},
			x_buttonActive: {
				transform: [{ scale: 0.9 }]
			}
		})
	)
}
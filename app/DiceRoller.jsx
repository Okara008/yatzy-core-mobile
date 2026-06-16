import { StyleSheet, Pressable, View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import { useEffect, useRef } from 'react';
import card_img_1 from '../assets/1-Yatzy.svg'
import card_img_2 from '../assets/2-Yatzy.svg' 
import card_img_3 from '../assets/3-Yatzy.svg' 
import card_img_4 from '../assets/4-Yatzy.svg' 
import card_img_5 from '../assets/5-Yatzy.svg' 
import card_img_6 from '../assets/6-Yatzy.svg' 
import RollBtn from './RollBtn';

const DiceRoller = ({active, dicesProps, setDicesProps, toggleDice, numOfRolls, dice_starting_index, set_dice_indexes, disable_rollBtn}) => {
	const { width } = useWindowDimensions()
	const cellwidth = width / 7
	const styles = imageStyling(width, cellwidth)
	const [Dice1, Dice2, Dice3, Dice4, Dice5] = dicesProps
	const imgPhotos = useRef([card_img_1, card_img_2, card_img_3, card_img_4, card_img_5, card_img_6]);

	const dice_random_indexes = useRef([]);
	const num_of_dices = 5;

	const save_dice = (index) => {
		if(numOfRolls > 0){
			let temp = [...dicesProps]
			toggleDice(index)
			temp[index].saved = !temp[index].saved
			let all_dices_saved = true;
			for (let i = dice_starting_index; i < (dice_starting_index + num_of_dices); i++) {
				if(!temp[i].saved){
					all_dices_saved = false;
					break
				}
			}
			if (all_dices_saved) {
				disable_rollBtn(prev => ({...prev, rollBtn: true}));
			}
			else if(numOfRolls < 3){
				disable_rollBtn(prev => ({...prev, rollBtn: false}));
			}
		}
	}
	
	useEffect(()=>{
		if (numOfRolls > 0 && numOfRolls <= 3) {
			for (let i = dice_starting_index; i < (dice_starting_index + num_of_dices); i++) {
				let array_index = i - dice_starting_index
				
				if(dicesProps[i].saved){
					continue
				}
				if(dice_random_indexes.current.length == num_of_dices){
					let rand = Math.floor(Math.random() * 6);

					if(!dicesProps[i].saved){
						dice_random_indexes.current[array_index] = rand; 
					}
				}else{
					dice_random_indexes.current.push(Math.floor(Math.random() * 6))
				}
				// dice_random_indexes.current = [3, 3, 3, 3, 3];
				setDicesProps(prev => {
					let copy = [...prev]
					copy[i].src = imgPhotos.current[dice_random_indexes.current[array_index]]
					return copy
				})
			}
			
		}
		set_dice_indexes([...dice_random_indexes.current])
		
	}, [numOfRolls])
		
	
	return(<>
		<View style={styles.diceRoller}>
			<Pressable onPress={() => save_dice(0)}  style={[styles.diceRolles, active ? styles.p1Dice : styles.p2Dice, dicesProps[0].saved && styles.savedDice]}>
				<Dice1.src width={cellwidth-5} height={cellwidth-5}/>
			</Pressable>
			<Pressable onPress={() => save_dice(1)}  style={[styles.diceRolles, active ? styles.p1Dice : styles.p2Dice, dicesProps[1].saved && styles.savedDice]}>
				<Dice2.src width={cellwidth-5} height={cellwidth-5}/>
			</Pressable>
			<Pressable onPress={() => save_dice(2)}  style={[styles.diceRolles, active ? styles.p1Dice : styles.p2Dice, dicesProps[2].saved && styles.savedDice]}>
				<Dice3.src width={cellwidth-5} height={cellwidth-5}/>
			</Pressable>
			<Pressable onPress={() => save_dice(3)}  style={[styles.diceRolles, active ? styles.p1Dice : styles.p2Dice, dicesProps[3].saved && styles.savedDice]}>
				<Dice4.src width={cellwidth-5} height={cellwidth-5}/>
			</Pressable>
			<Pressable onPress={() => save_dice(4)}  style={[styles.diceRolles, active ? styles.p1Dice : styles.p2Dice, dicesProps[4].saved && styles.savedDice]}>
				<Dice5.src width={cellwidth-5} height={cellwidth-5}/>
			</Pressable>
		</View>
	</>)
}
	
export default DiceRoller

const imageStyling = (width, cellwidth) => {
	return(
		StyleSheet.create({
			diceRoller: {
				marginVertical: 5,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				gap: 10
			},
			diceRolles: {
				width: cellwidth,
				height: cellwidth,
				borderWidth: 3,
				borderColor: 'grey',
				borderRadius: 11,
				objectFit: 'cover',
				overflow: 'hidden',
				alignItems: 'center',
				justifyContent: 'center',
			},
			p1Dice: {
				borderColor: 'yellow'
			},
			p2Dice: {
				borderColor: 'springgreen'
			},
			savedDice: {
				borderColor: 'grey'
			}
		})
	)
} 
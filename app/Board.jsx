import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import image1 from '../assets/1-Yatzy.svg'
import image2 from '../assets/2-Yatzy.svg' 
import image3 from '../assets/3-Yatzy.svg' 
import image4 from '../assets/4-Yatzy.svg' 
import image5 from '../assets/5-Yatzy.svg' 
import image6 from '../assets/6-Yatzy.svg' 
import image3x from '../assets/3x-Yatzy.svg' 
import image4x from '../assets/4x-Yatzy.svg' 
import imageSmall from '../assets/small-Yatzy.svg' 
import imageLarge from '../assets/large-Yatzy.svg' 
import image23 from '../assets/2_3-Yatzy.svg' 
import imageChance from '../assets/chance-Yatzy.svg' 
import imageFull from '../assets/5-in-a-row-Yatzy.svg' 
import { useEffect, useRef, useState} from 'react'
import Btn_cell from './Btn_cell.jsx'
import * as Progress from 'react-native-progress';

const Board = ({toggleRestart, hasRestarted, playTriggered, activeBoxP1, disable_playBtn, dice_indexes, triggerRoll, getTotalScore}) => {
	let { width } = useWindowDimensions()
	width = (width < 400 ? width : 300)
	const cellwidth = width / 9
	const styles = imageStyling(width, cellwidth)
	const [isOpen, setIsOpen] = useState(Array(13).fill(false));
	const [cellStates, setCellStates] = useState(
		Array(13).fill().map(() => ({
			yellow_cell:{
				disabled: true,
				focused: false
			},
			green_cell:{
				disabled: true,
				focused: false
			}
		}))
	);
	const cell_array_Ref = useRef([])
	const first_cell_index = 0;
	const indexOfActiveCell = useRef()
	const bonusPointsRef = useRef({p1: 0, p2: 0})
	const [bonusPoints, setBonusPoints] = useState({...bonusPointsRef.current})

	/*	const totalScoreRef = useRef({
		p1: [
			{ score: 1, isPlayed: true },
			{ score: 6, isPlayed: true },
			{ score: 3, isPlayed: true },
			{ score: 20, isPlayed: true },
			{ score: 15, isPlayed: true },
			{ score: 18, isPlayed: true },
			{ score: 23, isPlayed: true },
			{ score: 0, isPlayed: true },
			{ score: 25, isPlayed: true },
			{ score: 30, isPlayed: true },
			{ score: 0, isPlayed: true },
			{ score: 0, isPlayed: true },
			{ score: 0, isPlayed: false }
		],
		p2: [
			{ score: 1, isPlayed: true },
			{ score: 4, isPlayed: true },
			{ score: 9, isPlayed: true },
			{ score: 4, isPlayed: true },
			{ score: 10, isPlayed: true },
			{ score: 18, isPlayed: true },
			{ score: 0, isPlayed: true },
			{ score: 28, isPlayed: true },
			{ score: 25, isPlayed: true },
			{ score: 30, isPlayed: true },
			{ score: 0, isPlayed: true },
			{ score: 50, isPlayed: true },
			{ score: 0, isPlayed: false }
		]
	})
	const [totalScore, setTotalScore] = useState({...totalScoreRef.current})	*/
	
	/* useEffect(() => {
		getTotalScore(totalScoreRef)
	}, [])	*/
	
	const createScores = () => (
		Array.from({length: 13}, () => ({
			score: 0,
			isPlayed: false
		}))
	)

	const totalScoreRef = useRef({p1: createScores(), p2: createScores()})
	const [totalScore, setTotalScore] = useState({...totalScoreRef.current})

	function arrangeNumbers(array){
		for (let i = 0; i < array.length-1; i++) {
			for (let j = 0; j < array.length-1; j++) {
				if(array[j] > array[j+1]){
					let temp = array[j];
					array[j] = array[j+1];
					array[j+1] = temp;
				}
			}
		}
		return array
	}

	function getOnly1Num(index){
		activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;

		for (let i = 0; i < dice_indexes.length; i++) {
			const element = dice_indexes[i];
			
			if(element != index){
				continue
			}
			if(activeBoxP1){
				totalScoreRef.current.p1[index].score += (index + 1)
			}else{
				totalScoreRef.current.p2[index].score += (index + 1)
			}
			activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}));
		}            
	}

	function getonlyConsecutiveNums(numOfTimes, index){
		activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
		let isTrue = false;
		let total = 0;
		
		for (let i = 0; i < dice_indexes.length; i++) {
			total = 0;
			for (let j = 0; j < dice_indexes.length; j++) {
				if(dice_indexes[i] == dice_indexes[j]){
					total++
				}
			}
			
			if(total >= numOfTimes){
				isTrue = true
				break;
			}
		}
		
		if (isTrue && numOfTimes != 5) {
			for (let i = 0; i < dice_indexes.length; i++) {
				activeBoxP1 ? totalScoreRef.current.p1[index].score += (dice_indexes[i] + 1) : totalScoreRef.current.p2[index].score += (dice_indexes[i] + 1);
			}   
		}

		else if(isTrue && numOfTimes == 5){
			activeBoxP1 ? totalScoreRef.current.p1[index].score = 50 : totalScoreRef.current.p2[index].score = 50;
		}

		else{
			activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
		}

		activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}));
	}
	
	function getonly2x3Nums(index){
		activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
		let arrayOfNums = [...dice_indexes];
		arrayOfNums = [...arrangeNumbers(arrayOfNums)];
		
		if((arrayOfNums[0] == arrayOfNums[1] && arrayOfNums[2] == arrayOfNums[3]  && arrayOfNums[3] == arrayOfNums[4])
			|| (arrayOfNums[4] == arrayOfNums[3] && arrayOfNums[2] == arrayOfNums[1]  && arrayOfNums[0] == arrayOfNums[1])){
		
				activeBoxP1 ? totalScoreRef.current.p1[index].score = 25 : totalScoreRef.current.p2[index].score = 25;
		}
		else{
			activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
			
		}
		activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}));
	}

	function getonlySequenceNums(sequence, index){
		activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;

		if(sequence == 4){
			if((dice_indexes.includes(0) && dice_indexes.includes(1) && dice_indexes.includes(2) && dice_indexes.includes(3))||
				(dice_indexes.includes(1) && dice_indexes.includes(2) &&dice_indexes.includes(3) && dice_indexes.includes(4)) ||
				(dice_indexes.includes(2) && dice_indexes.includes(3) &&dice_indexes.includes(4) && dice_indexes.includes(5))
				){
					activeBoxP1 ? totalScoreRef.current.p1[index].score = 30 : totalScoreRef.current.p2[index].score = 30;
			}
		}
				
		else if(sequence == 5){
			if((dice_indexes.includes(0) && dice_indexes.includes(1) &&dice_indexes.includes(2) && dice_indexes.includes(3) && dice_indexes.includes(4)) ||
				(dice_indexes.includes(5) && dice_indexes.includes(1) &&dice_indexes.includes(2) && dice_indexes.includes(3) && dice_indexes.includes(4))){
				activeBoxP1 ? totalScoreRef.current.p1[index].score = 40 : totalScoreRef.current.p2[index].score = 40;
			}
		}
		else{
			activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
		}
		
		activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}));
	}
	
	function getSumOfAll(index) {
		activeBoxP1 ? totalScoreRef.current.p1[index].score = 0 : totalScoreRef.current.p2[index].score = 0;
		for (let i = 0; i < dice_indexes.length; i++) {
			if(activeBoxP1){
				totalScoreRef.current.p1[index].score += (dice_indexes[i] + 1);
			}else{
				totalScoreRef.current.p2[index].score += (dice_indexes[i] + 1);
			}
		}   
		activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}))
	}

	useEffect(()=>{
		if(hasRestarted){
			totalScoreRef.current = {p1: createScores(), p2: createScores()}
			setTotalScore({...totalScoreRef.current})
			
			bonusPointsRef.current = {p1: 0, p2: 0}
			setBonusPoints({...bonusPointsRef.current})

			setCellStates(
				Array(13).fill().map(() => ({
					yellow_cell:{
						disabled: true,
						focused: false
					},
					green_cell:{
						disabled: true,
						focused: false
					}
			})))

			getTotalScore(totalScoreRef.current)
			toggleRestart()
		}
	}, [hasRestarted])

	useEffect(() => {
		if(indexOfActiveCell.current >= first_cell_index && playTriggered){
			if(!activeBoxP1){
				totalScoreRef.current.p1[indexOfActiveCell.current].isPlayed = true
			}
			else {
				totalScoreRef.current.p2[indexOfActiveCell.current].isPlayed = true
			}
			setTotalScore({...totalScoreRef.current});
		}
		for (let i = 0; i < cellStates.length; i++) {
			setCellStates(
				Array(13).fill().map(() => ({
					yellow_cell:{
						disabled: true,
						focused: false
					},
					green_cell:{
						disabled: true,
						focused: false
					}
			})))
		}

		bonusPointsRef.current = {p1: 0, p2: 0}

		for (let i = 0; i < 6; i++) {
			const element2 = totalScoreRef.current.p2[i].score;
			const element1 = totalScoreRef.current.p1[i].score;
			if(element1 >= 0){
				bonusPointsRef.current.p1 += element1
			}
			if(element2 >= 0){
				bonusPointsRef.current.p2 += element2
			}
		}
		bonusPointsRef.current.p1 > 63 ? bonusPointsRef.current.p1 = 63 : null;
		bonusPointsRef.current.p2 > 63 ? bonusPointsRef.current.p2 = 63 : null;
		setBonusPoints({p1: bonusPointsRef.current.p1, p2: bonusPointsRef.current.p2})

		getTotalScore(totalScoreRef.current)
	}, [playTriggered])

	useEffect(()=>{
		if(triggerRoll > 0){
			for(let i = 0; i < cell_array_Ref.current.length; i++){
				if((activeBoxP1 && !totalScoreRef.current.p1[i].isPlayed) || (!activeBoxP1 && !totalScoreRef.current.p2[i].isPlayed)){
					if(activeBoxP1){
						cellStates[i].yellow_cell.disabled = false
						cellStates[i].green_cell.disabled = true
					}
					else{
						cellStates[i].yellow_cell.disabled = true
						cellStates[i].green_cell.disabled = false
					}

					cellStates[i].yellow_cell.focused = false
					cellStates[i].green_cell.focused = false

					activeBoxP1 ? totalScoreRef.current.p1[i].score = 0 : totalScoreRef.current.p2[i].score = 0;
					activeBoxP1 ? setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}})) : setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}))
				}
			}
		}
	}, [dice_indexes, triggerRoll])
	
	function boxFocus(index){
		indexOfActiveCell.current = index;
		disable_playBtn(prev => ({...prev, playBtn: false}));

		for (let i = 0; i < cell_array_Ref.current.length; i++) {
			setCellStates(prev => {
				let copy = [...prev];
				copy[i].yellow_cell.focused = false;
				copy[i].green_cell.focused = false;
				return copy
			})
			if(activeBoxP1 && !totalScoreRef.current.p1[i].isPlayed){
				totalScoreRef.current.p1[i].score = 0
			}else if(!activeBoxP1 && !totalScoreRef.current.p2[i].isPlayed){
				totalScoreRef.current.p2[i].score = 0
			}
		}

		setCellStates(prev => {
			let copy = [...prev];
			if(activeBoxP1){
				copy[index].yellow_cell.focused = true;
			}
			else{
				copy[index].green_cell.focused = true;
			}
			return copy
		})		
		
		switch (indexOfActiveCell.current) {
			case 0:
				getOnly1Num(0)
				break;
			case 1:
				getOnly1Num(1)
				break;
			case 2:
				getOnly1Num(2)
				break;
			case 3:
				getOnly1Num(3)
				break;
			case 4:
				getOnly1Num(4)
				break;
			case 5:
				getOnly1Num(5)
				break;
			case 6:
				getonlyConsecutiveNums(3, 6)
				break;
			case 7:
				getonlyConsecutiveNums(4, 7)
				break;
			case 8:
				getonly2x3Nums(8)
				break;
			case 9:
				getonlySequenceNums(4, 9)
				break;
			case 10:
				getonlySequenceNums(5, 10)
				break;
			case 11:
				getonlyConsecutiveNums(5, 11)
				break;
			case 12:
				getSumOfAll(12)
				break;
		
			default:
				break;
		}
		
		setTotalScore(prev => ({...prev, p1: {...totalScoreRef.current.p1}}))
		setTotalScore(prev => ({...prev, p2: {...totalScoreRef.current.p2}}))
	}

	return(
		<View style={[styles.main, {width: width * .95}]}>
			<View style={[styles.mainSection, {alignItems: 'flex-start'}]}>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={0} Image={image1} content="Count only 1s" boxFocus={boxFocus} totalp1={totalScore.p1[0].score} totalp2={totalScore.p2[0].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={1} Image={image2} content="Count only 2s" boxFocus={boxFocus} totalp1={totalScore.p1[1].score} totalp2={totalScore.p2[1].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={2} Image={image3} content="Count only 3s" boxFocus={boxFocus} totalp1={totalScore.p1[2].score} totalp2={totalScore.p2[2].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={3} Image={image4} content="Count only 4s" boxFocus={boxFocus} totalp1={totalScore.p1[3].score} totalp2={totalScore.p2[3].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={4} Image={image5} content="Count only 5s" boxFocus={boxFocus} totalp1={totalScore.p1[4].score} totalp2={totalScore.p2[4].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={5} Image={image6} content="Count only 6s" boxFocus={boxFocus} totalp1={totalScore.p1[5].score} totalp2={totalScore.p2[5].score}/>
				
				<View style={styles.bonus}>
					<View style={styles.bonusDiv} >
						<Text style={{fontSize: (cellwidth / 4)}} numberOfLines={1}>BONUS</Text>
						<Text style={{fontSize: (cellwidth / 2.5), fontWeight: '800'}} >+35</Text>
					</View>
					<View style={styles.bonusDiv}>
						<Text style={{fontSize: 10}}>{bonusPoints.p1}/63</Text>
						<Progress.Bar
							progress={bonusPoints.p1 / 63}
							width={35}
							height={10}
							borderRadius={5}
							color='rgb(80, 22, 12)'
							unfilledColor="#ddd"
						/>
					</View>
					<View style={styles.bonusDiv}>
						<Text style={{fontSize: 10}}>{bonusPoints.p2}/63</Text>
						<Progress.Bar
							progress={bonusPoints.p2 / 63}
							width={35}
							height={10}
							borderRadius={5}
							color='rgb(80, 22, 12)'
							unfilledColor="#ddd"
						/>
					</View>
				</View>
			</View>

			<View style={[styles.mainSection, {alignItems: 'flex-end'}]}>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={6} Image={image3x} content="3 of a kind" boxFocus={boxFocus} totalp1={totalScore.p1[6].score} totalp2={totalScore.p2[6].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={7} Image={image4x} content="4 of a kind" boxFocus={boxFocus} totalp1={totalScore.p1[7].score} totalp2={totalScore.p2[7].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={8} Image={image23} content="2 of a kind & 3 of a kind (25 pts)" boxFocus={boxFocus} totalp1={totalScore.p1[8].score} totalp2={totalScore.p2[8].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={9} Image={imageSmall} content="Sequence of 4 (30 pts)" boxFocus={boxFocus} totalp1={totalScore.p1[9].score} totalp2={totalScore.p2[9].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={10} Image={imageLarge} content="Sequence of 5 (40 pts)" boxFocus={boxFocus} totalp1={totalScore.p1[10].score} totalp2={totalScore.p2[10].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={11} Image={imageFull} content="5 of a kind (50 pts)" boxFocus={boxFocus} totalp1={totalScore.p1[11].score} totalp2={totalScore.p2[11].score}/>
				<Btn_cell cellStates={cellStates} ref_objects={cell_array_Ref} isOpen={isOpen} setIsOpen={setIsOpen} index={12} Image={imageChance} content="Any combination" boxFocus={boxFocus} totalp1={totalScore.p1[12].score} totalp2={totalScore.p2[12].score}/>
			</View>
		</View>
	)
}

export default Board

const imageStyling = (width, cellwidth) =>{
	return(
		StyleSheet.create({
			main: {
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				flexWrap: 'nowrap',
				borderWidth: 6.4,
				borderColor: 'rgb(80, 22, 12)',
				padding: 15,
				paddingBottom: 30,
				borderRadius: 32,
				marginVertical: 20,
				marginHorizontal: 10,
				alignSelf: 'center'
			},
			mainSection: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				gap: 11.2,
			},
			bonus: {
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
				fontSize: 3,
				flexDirection: 'row',
			},
			bonusDiv: {
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: cellwidth,
				gap: 0,
			},
		})
	)
}
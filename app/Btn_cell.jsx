import { Pressable, StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

const toggleOpenToolTip = (setIsOpen, index) => {
	setIsOpen(prev => {
		let copy = [...prev]
		copy[index] = !copy[index]
		for (let i = 0; i < copy.length; i++) {
			if (i == index) continue
			copy[i] = false
		}
		return copy
	})

}

function Btn_cell({cellStates, ref_objects, Image, isOpen, setIsOpen, index, content, boxFocus, totalp1, totalp2}) {
	let { width } = useWindowDimensions();
	width = (width < 400 ? width : 300)
	const cellwidth = width / 9
	const styles = imageStyling(cellwidth)
    return(<>
        <View style={styles.wrapper}>
			{isOpen[index] && (
				<Pressable style={styles.imgTooltipBtn} onPress={() => toggleOpenToolTip(setIsOpen, index)}>
					<Text style={styles.imgTooltipSmall} >{content}</Text>
				</Pressable>
			)}
            <View style={styles.imgTooltip}>
				<Pressable style={styles.moveImg} onPress={() => toggleOpenToolTip(setIsOpen, index)}>
					<Image  width={cellwidth-5} height={cellwidth-5} />
				</Pressable>

            </View>

            <Pressable 
				ref={el => {
					ref_objects.current[index] = { 
						...ref_objects.current[index], 
						yellow_cell: el
					}}}
					style={[
							styles.yellowsquare, styles.pointBox, 
							cellStates[index].yellow_cell.focused && styles.activeBox,
							cellStates[index].yellow_cell.disabled && styles.pointBoxDisabled
						]}
					disabled={cellStates[index].yellow_cell.disabled}
					onPress={() => boxFocus(index)}
				>
				<Text style={styles.pointBoxText}>{totalp1}</Text>
			</Pressable>                
            <Pressable 
				ref={el => {
					ref_objects.current[index] = { 
						...ref_objects.current[index], 
						green_cell: el
					}}}				
				disabled={cellStates[index].green_cell.disabled}
				style={[
					styles.greensquare, styles.pointBox, 
					cellStates[index].green_cell.focused && styles.activeBox,
					cellStates[index].green_cell.disabled && styles.pointBoxDisabled
				]}
				onPress={() => boxFocus(index)}
			>
				<Text style={styles.pointBoxText}>{totalp2}</Text>
			</Pressable>                
        </View>
    </>)
}

export default Btn_cell

const imageStyling = (cellwidth) =>{
	return (
		StyleSheet.create({
			wrapper:{
				alignItems: 'center',
				justifyContent: 'center',
				gap: 4,
				flexDirection: 'row',
			},
			imgTooltip: {
				overflow: 'visible',
				position: 'relative'
			},
			imgTooltipSmall: {
				fontSize: 10,
				fontWeight: 'bold',
				textAlign: 'center',
			},
			imgTooltipBtn:{
				backgroundColor: 'rgb(255, 255, 255)',
				paddingVertical: 3.2,
				paddingHorizontal: 3.2,
				borderRadius: 16,
				borderBottomLeftRadius: 0,
				position: 'absolute',
				left: 16,
				top: 0,
				zIndex: 10,
				width: cellwidth * 3,
				opacity: .9,
			},
			moveImg: {
				width: cellwidth,
				height: cellwidth,
				objectFit: 'cover',
				objectPosition: '0%',
				borderRadius: 9.6,
				borderWidth: 2,
				overflow: 'hidden',
				alignItems: 'center',
				justifyContent: 'center',
				borderColor: 'rgb(65, 5, 5)'
			},
			pointBox: {
				width: cellwidth,
				height: cellwidth,
				borderWidth: 2,
				borderColor: 'rgb(65, 5, 5)',
				borderRadius: 9.6,
				alignItems: 'center',
				justifyContent: 'center'
			},
			pointBoxDisabled: {
				opacity: .6
			},
			pointBoxText:{
				fontFamily: 'monospace',
				fontWeight: 'bold',
				fontSize: 12,
			},
			yellowsquare: {
				backgroundColor: 'rgba(255, 255, 0, 0.6)'
			},
			greensquare: {
				backgroundColor: 'rgba(0, 128, 0, 0.6)'
			},
			activeBox: {
				backgroundColor: 'rgba(255, 255, 255, 0.5)'
			},
		})
	)
}
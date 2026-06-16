import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import {useState, useEffect} from "react"

function Winner({viewPage, message, setViewPage, response}){
    let { width, height } = useWindowDimensions()
    width = (width < 400 ? width : 300)
	const styles = imageStyling(width, height)

    return(<>
        {viewPage && (
            <View style={styles.outerShell}>
                <View style={styles.confirmSection}>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.btnWrapper}>
                        <Pressable
                            onPress={() => {
                                setViewPage(prev => ({...prev, confirm: false}))
                                response()
                            }}
                            style={({pressed}) => ([ styles.confirmBtn, pressed && styles.confirmBtnPressed, {backgroundColor: '#2E7D32'}])}
                        >
                            <Text style={[styles.confirmBtnText, {color: '#FFFFFF'}]}>Yes</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => {
                                setViewPage(prev => ({...prev, confirm: false}))
                            }}
                            style={({pressed}) => ([ styles.confirmBtn, pressed && styles.confirmBtnPressed, {backgroundColor: '#D32F2F'}])}
                        >
                            <Text style={[styles.confirmBtnText, {color: '#FFFFFF'}]}>No</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        )}
    </>)
}

export default Winner

const imageStyling = (width, height) => {
    return(
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
            confirmSection: {
                position: 'absolute',
                top: height / 5,
                left: '50%',
                transform: [{ translateX: '-50%' }],
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
            message: {
                backgroundColor: 'rgb(153, 55, 38)',
                fontSize: 25,
                color: 'white',
                width: '100%',
                textAlign: 'center',
                marginBottom: height / 10,
                padding: 30,
                borderRadius: 30,
                fontStyle: 'italic'
            },
            btnWrapper: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%'
            },
            confirmBtn: {
                backgroundColor: 'wheat',
                paddingVertical: 5,
                paddingHorizontal: 20,
                width: width / 3,
                borderRadius: 10,
            },
            confirmBtnPressed:{
                opacity: .6
            },
            confirmBtnText: {
                textAlign: 'center'
            },
        })
    )
}
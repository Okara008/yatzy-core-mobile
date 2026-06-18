import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native'
import { useState, useRef, useEffect, useContext } from 'react'
import { StatsContext } from './Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import OuterShell from './OuterShell'

function Login({getStats, viewLoginPage}) {
    const {playerNames, setPlayerNames} = useContext(StatsContext)
    const {playerStats, updatePlayerStats} = useContext(StatsContext)
    const [errorMessage, setErrorMessage] = useState({p1: "", p2: ""})
    const [loginMethod, setLoginMethod] = useState({p1: '', p2: ''})

    const getLoginMethod = async() => {
        let is_valid = {p1: false, p2: false} 
        let updated_name = {...playerNames}
        

        if (loginMethod.p1 == 'guest') {
            is_valid.p1 = {name: ''};
            setPlayerNames(prev => ({...prev, p1: ''}))
            updated_name.p1 = ''
        }
        else if(loginMethod.p1 == '' ) {
            is_valid.p1 = await validate_user_exists(updated_name.p1)
            if(!is_valid.p1){
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p1 = "Username not found";
                    return copy
                })
            }else{
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p1 = "";
                    return copy
                })
            }
        }
        else if(loginMethod.p1 == 'create' ) {
            is_valid.p1 = !(await validate_user_exists(updated_name.p1))
            if(!is_valid.p1){
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p1 = "Username exists";
                    return copy
                })
            }else{
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p1 = "";
                    return copy
                })
            }
        }

        if (loginMethod.p2 == 'guest') {
            is_valid.p2 = {name: ''};
            setPlayerNames(prev => ({...prev, p2: ''}))
            updated_name.p2 = ''
        }
        else if(loginMethod.p2 == '' ) {
            is_valid.p2 = await validate_user_exists(updated_name.p2)
            if(!is_valid.p2){
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p2 = "Username not found";
                    return copy
                })
            }else{
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p2 = "";
                    return copy
                })
            }

        }
        else if(loginMethod.p2 == 'create' ) {
            is_valid.p2 = !(await validate_user_exists(updated_name.p2))
            if(!is_valid.p2){
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p2 = "Username exists";
                    return copy
                })
            }else{
                setErrorMessage(prev => {
                    let copy = {...prev};
                    copy.p2 = "";
                    return copy
                })
            }
        }
        
        if(updated_name.p1 == '' && loginMethod.p1 != 'guest'){
            is_valid.p1 == false
            setErrorMessage(prev => {
                let copy = {...prev};
                copy.p1 = "Username field empty";
                return copy
            })
        }
        else if(updated_name.p2 == '' && loginMethod.p2 != 'guest'){
            is_valid.p2 == false
            setErrorMessage(prev => {
                let copy = {...prev};
                copy.p2 = "Username field empty";
                return copy
            })
        }
        else if(is_valid.p1 && is_valid.p2){
            if(loginMethod.p1 == 'create'){
                is_valid.p1 = await create_user_row(updated_name.p1) 
            }
            if(loginMethod.p2 == 'create'){
                is_valid.p2 = await create_user_row(updated_name.p2) 
            }
            getStats()
        }
    }

    const create_user_row = async (name) => {
        const new_Data = {
            name: name,
            wins: 0,
            draws: 0,
            losses: 0,
            avg_points: 0,
            highest_points: 0,
        }
        updatePlayerStats(prev => {
            let data = [...prev, new_Data]
            setItem(data)
            return data;
        })
        const setItem = (data) => {
            AsyncStorage.setItem('yatzy_stats', JSON.stringify(data))
        }
        return new_Data
    }

    const validate_user_exists = async (name) => {
        if(!name) return false;
        
        for (let i = 0; i < playerStats.length; i++) {
            if(playerStats[i].name.toLowerCase() == name.toLowerCase()){
                return playerStats[i];
            }
        }

        return false
    }

    useEffect(() => {
        setLoginMethod({p1: '', p2: ''})
    }, [viewLoginPage])

    const { width, height } = useWindowDimensions()
	const styles = imageStyling(width, height)

return(<>
    {viewLoginPage && (
		<OuterShell>
			<View style={[styles.innertext, styles.loginForm]}>
				<Text style={styles.innertextH3}>Welcome, Let's Play Yatzy!!</Text>

				<View style={styles.form_content}>
					<View style={styles.userLoginDetails}>
						<TextInput onSubmitEditing={getLoginMethod} value={playerNames.p1} style={styles.innertextInput} onChangeText={(text) => setPlayerNames(prev => ({...prev, p1: text.trim()}))} placeholderTextColor="rgba(245, 222, 179, .7)" placeholder="Enter Username..."/>
						{errorMessage.p1 && (
                            <Text style={styles.errorMessage}>{errorMessage.p1}</Text>
                        )}
						<View style={styles.login_btns}>
                            <Pressable 
                                style={[
                                    styles.login_methods_btn,
                                    (loginMethod.p1 == 'create') && styles.checked_btn
                                ]}
                                onPress={() => setLoginMethod(prev => {
                                    let copy = {...prev};
                                    if(copy.p1 == 'create') copy.p1 = ''
                                    else copy.p1 = 'create'
                                    return copy
                                })}
                            >
                                <Text>Create</Text>
                            </Pressable>
                            <Pressable 
                                style={[
                                    styles.login_methods_btn,
                                    (loginMethod.p1 == 'guest') && styles.checked_btn
                                ]}
                                onPress={() => setLoginMethod(prev => {
                                    let copy = {...prev};
                                    if(copy.p1 == 'guest') copy.p1 = ''
                                    else copy.p1 = 'guest'
                                    return copy
                                })}
                            >
                                <Text>Guest</Text>
                            </Pressable>
						</View>
					</View>
					
					<View style={styles.userLoginDetails}>
						<TextInput onSubmitEditing={getLoginMethod} value={playerNames.p2} style={styles.innertextInput} onChangeText={(text) => setPlayerNames(prev => ({...prev, p2: text.trim()}))} placeholderTextColor="rgba(245, 222, 179, .7)" placeholder="Enter Username..."/>
						{errorMessage.p2 && (
                            <Text style={styles.errorMessage}>{errorMessage.p2}</Text>
                        )}
						<View style={styles.login_btns}>
                            <Pressable 
                                style={[
                                    styles.login_methods_btn,
                                    (loginMethod.p2 == 'create') && styles.checked_btn
                                ]}
                                onPress={() => setLoginMethod(prev => {
                                    let copy = {...prev};
                                    if(copy.p2 == 'create') copy.p2 = ''
                                    else copy.p2 = 'create'
                                    return copy
                                })}
                            >
                                <Text>Create</Text>
                            </Pressable>
                            <Pressable 
                                style={[
                                    styles.login_methods_btn,
                                    (loginMethod.p2 == 'guest') && styles.checked_btn
                                ]}
                                onPress={() => setLoginMethod(prev => {
                                    let copy = {...prev};
                                    if(copy.p2 == 'guest') copy.p2 = ''
                                    else copy.p2 = 'guest'
                                    return copy
                                })}
                            >
                                <Text>Guest</Text>
                            </Pressable>
						</View>
					</View>
				</View>
				<Pressable
					style={({pressed}) => ([styles.start_game_btn, pressed && styles.start_game_btnActive])} 
                    onPress={getLoginMethod}
				>
                    <Text>Start Game</Text> 
				</Pressable>
			</View>
		</OuterShell>
    )}
</>)
}

export default Login

const imageStyling = (height) => {
	return (
        StyleSheet.create({
            innertext: {
                backgroundColor: 'rgb(153, 55, 38)',
                maxWidth: 800,
                width: '100%',
                minHeight: 240,
                padding: 32,
                borderRadius: 8,
            },
            form_content: {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 32,
                gap: 32
            },
            userLoginDetails:{
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center'
            },
            innertextH3: {
                textAlign: 'center',
                color: 'white',
                fontSize: 27,
                borderBottomWidth: 2,
                borderBottomColor: 'black',
                marginBottom: 16,
                paddingVertical: 8,
                paddingHorizontal: 8
            },
            innertextInput: {
                width: '100%',
                color: 'wheat',
                paddingVertical: 16,
                paddingHorizontal: 32,
                borderRadius: 8,
                borderWidth: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)'
            },
            login_btns: {
                marginVertical: 16,
                marginHorizontal: 0,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                justifyContent: 'space-around'
            },
            checked_btn:{
                backgroundColor: 'green'
            },
            login_methods_btn: {
                backgroundColor: 'rgba(245, 222, 179, 0.7)',
                paddingVertical: 6.4,
                paddingHorizontal: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: 'black',
                borderRadius: 6.4
            },
            start_game_btnActive: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
            },
            errorMessage: {
                textAlign: 'center',
                display: 'flex',
                color: '#FFC107',
                marginTop: 6.4
            },
            loadingSpinner: {
                width: 16,
                height: 16
            },
            start_game_btn: {
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderWidth: 0,
                backgroundColor: 'white',
                borderRadius: 32,
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 7,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            },
        })
    )
}
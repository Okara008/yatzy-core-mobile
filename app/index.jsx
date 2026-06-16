import { StyleSheet, Text, View } from 'react-native'
import Game from './Game'
import StatsProvider from './Context';

const index = () => {
    return (
        <StatsProvider>
            <Game/>
        </StatsProvider>
    )
}

export default index

const styles = StyleSheet.create({})
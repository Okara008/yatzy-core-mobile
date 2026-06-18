import { StyleSheet, View } from 'react-native'

const OuterShell = ({children}) => {
    return (
        <View style={styles.outerShell}>{children}</View>
    )
}
export default OuterShell

const styles = StyleSheet.create({
    outerShell: {
        position: 'absolute',
        zIndex: 1000,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
})
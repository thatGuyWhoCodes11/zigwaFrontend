import { Image, View, StyleSheet } from 'react-native';
export default function LoadingAnimation() {
    return (
        <View style={styles.Overlay}>
            <Image source={require('./../images/loading-gif.gif')} />
        </View>
    )
}
const styles = StyleSheet.create({
    Overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
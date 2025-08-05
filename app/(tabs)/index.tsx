import { Image } from 'expo-image';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

export default function HomeScreen() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [torchOn, setTorchOn] = useState(false);
	const [isSosActive, setIsSosActive] = useState(false);
	const camRef = useRef(null);
	const intervalRef = useRef<NodeJS.Timer | null>(null);

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === 'granted');
		})();
	}, []);

	const toggleTorch = () => {
		if (isSosActive) {
		  setIsSosActive(false);
		  if (intervalRef.current) {
		    clearInterval(intervalRef.current);
		    intervalRef.current = null;
		  }
		}

		setTorchOn((prev) => !prev);
	};

	const sos = () => {
	  setIsSosActive((prev) => {
		const newState = !prev;

		if (newState) {
		  intervalRef.current = setInterval(() => {
		    setTorchOn((prev) => !prev);
		  }, 500);
		} else {
		  if (intervalRef.current) {
		    clearInterval(intervalRef.current);
		    intervalRef.current = null;
		  }
		  setTorchOn(false);
		}

		return newState;
	  });
	};

	if (hasPermission === null) return null;
	if (hasPermission === false) return <View><Text>No camera permission</Text></View>;

	return (
		<ScrollView
			contentContainerStyle={{
				flex: 1,
				alignItems: 'center',
				padding: 32,
				backgroundColor: '#181818',
				paddingTop: 100,
			}}>
			<CameraView
				style={{
					display: 'none',
				}}
				ref={camRef}
				type='back'
				enableTorch={torchOn}
			></CameraView>
			<View style={{
				flexDirection: 'row',
				alignItems: 'center',
				gap: 8,
			}}>
			<Text style={{
				color: '#fff', 
				fontSize: 32, 
				fontWeight: 900
			}} >Torch</Text>
			</View>
			<View style={{
				marginBottom: 60,
				marginTop: 130,
				display: 'flex',
				gap: 15,
				alignItems: 'center',
				justifyContent: 'center',
				}}>
				<Text style={{
					color: '#fff', 
					fontSize: 28, 
					fontWeight: 700
					}}>{torchOn ? 'ON' : 'OFF'}</Text>

				<TouchableOpacity style={{
					width: 150,
					height: 150,
					display: 'flex',
					borderWidth: 5,
					borderRadius: 999,
					padding: 15,
					borderColor: '#ff4500',
					alignItems: 'center',
					justifyContent: 'center',
					}} onPress={toggleTorch}>
					{
						torchOn ? (
							<Image style={{
							width: '100%',
							height: '100%',
							resizeMode: 'contain',
							}} source={ require('@/assets/images/torch-on.png') } />
						) : (
							<Image style={{
							width: '100%',
							height: '100%',
							resizeMode: 'contain',
							}} source={ require('@/assets/images/torch-off.png') } />
						)
					}
				</TouchableOpacity>
			</View>
			<View style={{}}>
				<TouchableOpacity
					style={[
					  {
						width: 150,
						display: 'flex',
						borderRadius: 999,
						padding: 15,
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: '#202020',
					  },
					  isSosActive && {
						shadowColor: '#eee',
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.5,
						shadowRadius: 4,
						elevation: 5,
					  }
					]}


						onPress={sos}>
					<Text style={{
					color: '#fff', 
					fontSize: 16, 
					fontWeight: 700
					}}>SOS</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

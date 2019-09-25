/**
 * @flow
 */

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import * as Permissions from 'expo-permissions';
import { PropTypes } from 'prop-types';
import { postBlob } from '../../../Utils/postBlob';
import Button from '../Button/Button';
import styles from './styles';

export class SpeechToText extends Component {
	constructor(props) {
		super(props);
		this.recording = null;
		this.sound = null;
		this.isSeeking = false;
		this.shouldPlayAtEndOfSeek = false;
		this.recordingSettings = JSON.parse(JSON.stringify(Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY));
		this.state = {
			haveRecordingPermissions: false,
			isLoading: false,
			isPlaybackAllowed: false,
			muted: false,
			soundPosition: null,
			soundDuration: null,
			recordingDuration: null,
			shouldPlay: false,
			isPlaying: false,
			isRecording: false,
			fontLoaded: false,
			shouldCorrectPitch: true,
			volume: 1.0,
			rate: 1.0
		};
	}

	componentDidMount = async () => {
		await Font.loadAsync({
			'cutive-mono-regular': require('../../../assets/fonts/CutiveMono-Regular.ttf')
		});
		this.setState({ fontLoaded: true });
		this._askForPermissions();
	};

	_askForPermissions = async () => {
		const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
		this.setState({
			haveRecordingPermissions: response.status === 'granted'
		});
	};

	_updateScreenForRecordingStatus = status => {
		if (status.canRecord) {
			this.setState({
				isRecording: status.isRecording,
				recordingDuration: status.durationMillis
			});
		} else if (status.isDoneRecording) {
			this.setState({
				isRecording: false,
				recordingDuration: status.durationMillis
			});
			if (!this.state.isLoading) {
				this._stopRecordingAndEnablePlayback();
			}
		}
	};

	async _stopPlaybackAndBeginRecording() {
		this.setState({ isLoading: true });
		if (this.sound !== null) {
			await this.sound.unloadAsync();
			this.sound.setOnPlaybackStatusUpdate(null);
			this.sound = null;
		}
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: true,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: true
		});
		if (this.recording !== null) {
			this.recording.setOnRecordingStatusUpdate(null);
			this.recording = null;
		}

		const recording = new Audio.Recording();
		// console.log('new recording', recording);
		await recording.prepareToRecordAsync(this.recordingSettings);
		recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

		this.recording = recording;
		await this.recording.startAsync();
		this.setState({ isLoading: false });
	}

	async _stopRecordingAndEnablePlayback() {
		this.setState({ isLoading: true });
		try {
			await this.recording.stopAndUnloadAsync();
			// console.log(recording.createNewLoadedSoundAsync());
		} catch (error) {}
		const info = await FileSystem.getInfoAsync(this.recording.getURI());
		// console.log('recording', this.recording);
		// console.log(`FILE INFO: ${JSON.stringify(info)}`);
		const response = await fetch(info.uri);
		const blob = await response.blob();
		const data = await postBlob(blob);
		await Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
			playsInSilentModeIOS: true,
			playsInSilentLockedModeIOS: true,
			shouldDuckAndroid: true,
			interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
			playThroughEarpieceAndroid: false,
			staysActiveInBackground: true
		});
		const { sound } = await this.recording.createNewLoadedSoundAsync(
			{
				isLooping: true,
				isMuted: this.state.muted,
				volume: this.state.volume,
				rate: this.state.rate,
				shouldCorrectPitch: this.state.shouldCorrectPitch
			},
			this._updateScreenForSoundStatus
		);
		this.sound = sound;
		this.props.saveRecordedText(data.text);
		this.setState({ isLoading: false });
	}

	_onRecordPressed = () => {
		if (this.state.isRecording) {
			this._stopRecordingAndEnablePlayback();
		} else {
			this._stopPlaybackAndBeginRecording();
		}
	};

	render() {
		if (!this.state.fontLoaded) {
			return <View style={styles.emptyContainer} />;
		}

		if (!this.state.haveRecordingPermissions) {
			return (
				<View style={styles.container}>
					<View />
					<Text style={[styles.noPermissionsText, { fontFamily: 'cutive-mono-regular' }]}>
						You must enable audio recording permissions in order to use this app.
					</Text>
					<View />
				</View>
			);
		}
		return (
			<Button
				onPress={this._onRecordPressed}
				disabled={this.state.isLoading}
				accessibilityLabel="Tap me to record the name of your list"
			>
				{this.state.isRecording ? 'Stop' : 'Start'} Recording
			</Button>
		);
	}
}

SpeechToText.propTypes = {
	saveRecordedText: PropTypes.func
};

export default SpeechToText;

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { logIn } from '../../actions';
import { logInUser } from '../../Utils/logInUser';

const initialState = {
	accountType: '',
	username: '',
	password: '',
	message: '',
	error: '',
};

export class Login extends Component {
	state = initialState;

	handleChange = (name, value) => {
		this.setState({
			[name]: value
		});
	};

	handleSubmit = async () => {
		const { username, password } = this.state;
		this.setState({
			error: ''
		})
		if(this.state.username === '' || this.state.password === ''){
			this.setState({message: "Please type in a username and password"}) 
		} else {
			const user = await this.logInUser(username, password);
			this.props.logIn(user)
			this.setState({message: '', error: user.message})
		}
		if(!this.state.error && this.state.username && this.state.password){
			this.setState({
				accountType: '',
				username: '',
				password: ''
			})
			this.props.navigation.navigate('User', this.props.userAccount)
		} 
	
	}

	logInUser = async (username, password) => {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({username, password})
		};
		try {
			const response = await fetch('https://sophia-be.herokuapp.com/api/v1/login', options);
			const user = await response.json();
			return user
		} catch (error) {
			throw new Error(`failed to post profile: ${error.message}`);
		} 
	}

	render () {
		return (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<Text style={styles.header}> Log In </Text>
				</View>
				<TextInput
					style={styles.input}
					value={this.state.username}
					placeholder="Username"
					onChangeText={value => this.handleChange('username', value)}
					accessibilityLabel={"Username Input"}
					accessibile={true}
					placeholderTextColor="maroon"
				/>
				<TextInput
					style={styles.input}
					value={this.state.password}
					placeholder="Password"
					onChangeText={value => this.handleChange('password', value)}
					accessibilityLabel={"Password Input"}
					accessibile={true}
					placeholderTextColor="maroon"
				/>
				<Text style={styles.text}>{this.state.message}</Text>
				<View style={styles.routes}>
					<TouchableHighlight
						underlayColor="black"
						accessibilityLabel="Tap me to log into your account."
						accessible={true}
						onPress={this.handleSubmit}
						style={styles.touchExpander}>
						<Text style={styles.button}> Log In </Text>
					</TouchableHighlight>
				</View>
				<Text style={styles.text}>{this.state.error}</Text>
			</View>
		);
	}
}

const mapStateToProps = state => ({
	userAccount: state.userAccount
})

const mapDispatchToProps = dispatch => ({
	logIn: user => dispatch(logIn(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%'
	},
	headerContainer: {
		borderBottomColor: 'maroon',
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginBottom: 10
	},
	header: {
		fontSize: 45,
		fontFamily: 'Didot'
	},
	routes: {
		flexDirection: 'column',
		backgroundColor: 'maroon',
		width: '90%',
		height: '10%',
		borderRadius: 30,
		justifyContent: 'space-evenly',
		margin: 5
	},
	button: {
		color: 'white',
		fontSize: 35,
		fontFamily: 'Didot',
		textAlign: 'center',
		marginTop: 10,
		height: 50
	},
	input: {
		width: '90%',
		height: 80,
		fontSize: 25,
		fontFamily: 'Didot',
		paddingLeft: 5,
		margin: 10,
		backgroundColor: 'lightgray',
		color: 'black'
	},
	touchExpander: {
		height: '90%',
		borderRadius: 30,
		width: '100%'
	},
	text: {
		fontSize: 15,
		fontFamily: 'Didot',
		color: 'maroon'
	}
});

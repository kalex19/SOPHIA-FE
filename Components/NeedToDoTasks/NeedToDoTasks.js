import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { loadTasks } from '../../actions';
import { fetchClientTasks } from '../../Utils/clientApiCalls';
import { fetchCaretakerTasks } from '../../Utils/caretakerApiCalls';
import { ScrollView } from 'react-native-gesture-handler';
import { PropTypes } from 'prop-types';
import { styles } from './styles';
import { Task } from '../common/Task/Task'
import Header from '../common/Header/Header';

export class NeedToDoTasks extends Component {
	componentDidMount = async () => {
		this.props.user.role === 'caretaker' ? await this.returnUpdatedCaretakerTask() : this.returnUpdatedTask();
	};

	returnUpdatedCaretakerTask = async () => {
		const list = this.props.navigation.state.params;
		const tasks = await fetchCaretakerTasks(list.id);
		this.props.loadTasks(tasks);
	};

	returnUpdatedTask = async () => {
		const list = this.props.navigation.state.params;
		const { user } = this.props;
		const tasks = await fetchClientTasks(list.id, user.id);
		this.props.loadTasks(tasks);
	};

	// check functionality & fetches

	render() {
		const { name } = this.props.navigation.state.params;
		const { tasks } = this.props;
		const allTasks = tasks.map(task => {
			return (
				<View style={styles.lists} key={task.id}>
					<Task task={task} />
				</View>
			);
		});
		return (
			<View>
				<View style={styles.listHeader}>
					<Header>{name}</Header>
				</View>
				<ScrollView>
					{tasks.length < 1 && (
						<View>
							<Text>No tasks yet!</Text>
						</View>
					)}

					<View>{allTasks}</View>
					<View style={{ height: 200 }}></View>
				</ScrollView>
			</View>
		);
	}
}

export const mapStateToProps = state => ({
	tasks: state.tasks,
	user: state.userAccount
});

export const mapDispatchToProps = dispatch => ({
	loadTasks: tasks => dispatch(loadTasks(tasks))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NeedToDoTasks);

NeedToDoTasks.propTypes = {
	user: PropTypes.object,
	tasks: PropTypes.array
};

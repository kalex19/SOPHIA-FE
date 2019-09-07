import React, { Component } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { loadLists, editList } from "../../actions";
import { fetchLists, postList, deleteList } from '../../apiCalls';

class ClientList extends Component {
  state = {
    addList: false,
    list_title: "",
    displayEdit: false,
    list_edit_input: ""
  };

  componentDidMount = async () => {
    await this.returnUpdatedList()
  }

  returnUpdatedList = async () => {
    const lists = await fetchLists();
    this.props.loadLists(lists)
  }

  toggleAddList = () => {
    this.setState({ addList: !this.state.addList });
  };

  toggleEditName = () => {
    this.setState({ displayEdit: !this.state.displayEdit });
  };

  handleChange = input => {
    this.setState({ list_title: input });
  };

  handleEditList = input => {
    this.setState({ list_edit_input: input });
  };

  handleSubmit = async newList => {
    const { list_title } = this.state;
    newList = { name: list_title };
    await postList(newList)
    this.returnUpdatedList();
    this.setState({ list_title: "" });
  };

  eraseList = async listId => {
    await deleteList(listId)
    this.returnUpdatedList()
  }

  handleSubmitEdit = listId => {
    const { list_edit_input } = this.state;
    this.props.editList(list_edit_input, listId);
    this.setState({ list_edit_input: "", displayEdit: false });
  };

  render() {
    const { lists } = this.props
    const allLists = lists.map(list => {
      return (
        <View style={styles.lists} key={list.id}>
          <TouchableHighlight
            underlayColor="black"
            accessibilityLabel="Tap me to open form and edit your list name."
            accessible={true}
            onPress={() => this.toggleEditName()}
          >
            <Text style={styles.listItem}>Edit Name</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor="black"
            accessibilityLabel={`Tap me to navigate to your ${list.name} list. From there view or create your tasks.`}
            accessible={true}
            
          >
          </TouchableHighlight>
            {!this.state.displayEdit && (
              <Text 
              style={styles.listName}
              onPress={() => {
              this.props.navigation.navigate("IndividualList", list)
            }
            }
              >
              {`${list.name}`}
              </Text>
            )}
            {this.state.displayEdit && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Edit list"
                  value={this.state.list_edit_input}
                  onChangeText={this.handleEditList}
                ></TextInput>
                <TouchableHighlight
                  underlayColor="black"
                  accessibilityLabel="Tap me to submit your edited list name."
                  accessible={true}
                  onPress={() => this.handleSubmitEdit(list.id)}
                >
                  <Text style={styles.listItem}>Edit</Text>
                </TouchableHighlight>
              </View>
            )}
          {/* </TouchableHighlight> */}
          <View>
            <Button title="X" onPress={() => this.eraseList(list.id)} />
          </View>
        </View>
      );
    });
    return (
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>My Todo Lists</Text>
        </View>
        <View>{allLists}</View>
        <TouchableHighlight
          underlayColor="black"
          accessibilityLabel="Tap me to navigate to your todo lists. From there view or create your tasks."
          accessible={true}
          onPress={this.toggleAddList}
          style={styles.addListContainer}
        >
          <Text style={styles.listName}> + ADD NEW LIST </Text>
        </TouchableHighlight>
        {this.state.addList && (
          <View style={styles.align}>
            <TextInput
              style={styles.input}
              placeholder="List name"
              value={this.state.list_title}
              onChangeText={this.handleChange}
            ></TextInput>
            <TouchableHighlight
              underlayColor="black"
              accessibilityLabel="Tap me to submit the title of your list."
              accessible={true}
              onPress={() => this.handleSubmit()}
              style={styles.addListContainer}
            >
              <Text style={styles.plus}> + </Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    borderColor: "maroon",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    padding: 10
  },
  header: {
    fontSize: 40,
    fontFamily: "Didot",
    textAlign: "center"
  },
  addListContainer: {
    backgroundColor: "maroon",
    alignItems: "center",
    marginRight: 30,
    marginLeft: 30,
    padding: 20,
    borderRadius: 40,
    width: "80%",
    justifyContent: "center"
  },
  lists: {
    backgroundColor: "maroon",
    alignItems: "center",
    margin: 10,
    padding: 20
  },
  listName: {
    color: "white",
    fontSize: 20,
    fontFamily: "Didot"
  },
  input: {
    height: 70,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    fontSize: 40,
    textAlign: "center"
  },
  align: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  plus: {
    fontSize: 30,
    color: "white"
  },
  listItem: {
    fontSize: 25,
    color: "white"
  }
});

export const mapStateToProps = state => ({
  lists: state.lists
});

export const mapDispatchToProps = dispatch => ({
  loadLists: lists => dispatch(loadLists(lists)),
  editList: (nameToChange, listId) => dispatch(editList(nameToChange, listId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientList);

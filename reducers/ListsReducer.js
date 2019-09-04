export const listsReducer = (state = [], action) => {
  switch (action.type) {
    case "LOAD_LISTS":
      return action.lists;
    case "ADD_LIST":
      return [ ...state, action.newList ]
    default:
      return state;
  }
};
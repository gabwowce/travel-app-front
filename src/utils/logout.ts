export const logout = async (dispatch: AppDispatch) => {
  dispatch(travelApi.endpoints.logoutUser.initiate());
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
  dispatch(clearAuth());
};

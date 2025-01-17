import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,  // for profile
        selectedUser: null  // for selecting chat user
    },

    reducers: {
        setAuthuser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;  
        }
    }
});

export const {
    setAuthuser,
    setSuggestedUsers,
    setUserProfile,
    setSelectedUser
} = authSlice.actions; 

export default authSlice.reducer;
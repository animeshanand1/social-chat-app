import { createSlice } from "@reduxjs/toolkit";
const token = localStorage.getItem('token');

const authSlice=createSlice({
    name:'auth',
    initialState:{
        token:token || null
    },
    reducers:{
        setToken:(state,action)=>{
            state.token=action.payload
            localStorage.setItem('token',action.payload)
           
        },
        clearToken:(state,action)=>{
            state.token=null
            localStorage.removeItem('token')
            localStorage.removeItem("userId");
            localStorage.removeItem("profileId");
            localStorage.removeItem("username");
        }
    }
})
export const {setToken,clearToken}=authSlice.actions;
export default authSlice.reducer;
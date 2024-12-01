import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
export const fetchProfile=createAsyncThunk(
    "profile/fetchProfile",
    async(_,{getState,rejectWithValue})=>{
        try {
            const userId=localStorage.getItem('userId')
            const token=getState().auth.token
            const response=await axios.get(`http://localhost:5000/profile/getMyaccount/${userId}`)
           
            return response.data
                
        } catch (error) {
            console.error("Error fetching profile:", error);
            return rejectWithValue("Failed to fetch profile");
        }
    }
)

const profileSlice=createSlice({
    name:"profile",
    initialState:{
        data:{
            firstName: "",
            lastName: "",
            birthday: "",
            city: "",
            profilePhoto: "",
            coverPhoto: ""
        },
        status:"idle",
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProfile.pending,(state)=>{
            state.status="loading";
            state.error=null;
        })
        .addCase(fetchProfile.fulfilled,(state,action)=>{
            state.status="succeeded";
            state.data=action.payload ;
        })
        .addCase(fetchProfile.rejected,(state,action)=>{
            state.status="failed" ;
            state.error=action.payload ;
        })
    }
})

export default profileSlice.reducer
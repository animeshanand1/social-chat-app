import React, { useEffect, useState } from 'react'
import ProfileCard from '../SuggestedCards/SuggestCard'

const Suggested = () => {
  
  return (
    <div className='profile-cards-suggestion'>
       {/* <div><ProfileCard/></div>
       <div><ProfileCard/></div>
       <div><ProfileCard/></div>
       <div><ProfileCard/></div>
       <div><ProfileCard/></div>
       <div><ProfileCard/></div>
       <div><ProfileCard/></div> */}
       {[1,2,3,4,5,6,7,8,9,10,11,12,13].map((item)=><ProfileCard key={item}/>)}
    </div>
  )
}

export default Suggested
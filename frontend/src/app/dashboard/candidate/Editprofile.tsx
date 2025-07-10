import React from 'react'
import CandidateLayout from '../../../Layouts/CandidateLayout'
import MultiStepForm from '../../onboarding/candidate/about-yourself/page'
const Editprofile:React.FC =()=>  {
  return (
   <CandidateLayout>

    <div className="max-w-6xl mx-auto px-6">
            <MultiStepForm onSuccess={()=>{}}/>
          </div>
   </CandidateLayout>
  )
}

export default Editprofile

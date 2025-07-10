import React from 'react'
import RecruiterLayout from '../../../Layouts/RecruiterLayout'
import MultiStepForm from '../../onboarding/recruiter/about-yourself/page'
const CompanyProfile:React.FC =()=>  {
  return (
<RecruiterLayout>
    <div className="max-w-6xl mx-auto px-6">
            <MultiStepForm onSuccess={()=>{}}/>
          </div>
   </RecruiterLayout>
  )
}

export default CompanyProfile
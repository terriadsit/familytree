// FAQ are available to all. Only signed in users may use the <Contact />
// form. Other viewers may see a contact email address as a tooltip

import TermsAndConditions from '../termsAndConditions/TermsAndConditions'
//import TermsAndConditions from '../termsAndConditions/TermsAndConditions'
import Contact from '../../components/Contact'
import { useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'

// styles
import './Faq.css'

export default function Faq() {

  const { user } = useAuthContext()
  const [isShown, setIsShown] = useState(false)

  return (
    <div className='container'>
        <h4 className='heading'>Frequently Asked Questions</h4>
        <br></br>
        <div className="faq-list">
            <b>About:</b>
              <ul>
              <li>
                This is a web application where you are able to save memories and photos
                of family members. 
              </li>
              <li>
                  Add yourself and your ancestors.
              </li>
              <li>
                  Once people are entered into the website, you are
                  able to add/update them as relatives to one another.
              </li>
              <li> Anyone who signs in is able to add people. Only the 
                person who entered someone may delete or edit them.
              </li>
              <li>
                Anyone can comment on anyone else in the collection or 
                share a memory or a photo.
              </li>
              <li>
                Chrome or Firefox are the recommended browsers.
              </li>
              <li>
                  This is a family friendly site. Please contact us
                  if you see inappropriate content.
              </li>
            </ul>
            <br></br>
            <b>Best Practices:</b>
            
            <p>People generally prefer to add themselves rather than have a relative 
                add them. That way, the person is able to edit or remove any comments
                or information about themselves. For example, it is preferable to 
                ask a sibling before adding them in case they prefer to add themselves.
            </p>
            <br></br>
            <b>PDF and image size limitations</b>
            <ul>
              <li>The size limitations on file uploads are in place because
                Google only provides a certain amount of free file storage. 
                Family Tree provides some compression of images prior to uploading. 
                After this compression, images must be less than 100 kb.
              </li>
              <li>
                  Single page PDF files may often be saved as images which
                  may be resized.
              </li>
              <li>
                  The PC software, Paint, included free on most PC's, resizes
                  photos. 
              </li>
              <li>
                  If you have an interest in paying for storage in order to upload
                  larger photos, please contact us. 
              </li>
            </ul>
            <TermsAndConditions />
        </div>
        <br></br>
        <div >
            <p 
              className='contact'
              onMouseEnter={() => setIsShown(true)}
              onMouseLeave={() => setIsShown(false)}
            >
              <b>Contact Us:</b>
            </p>
            {(!user && isShown) && <p className='tip'>email: TerriAdsit@yahoo.com</p>}
            {user && <Contact />}
        </div>

    </div>
  )
}
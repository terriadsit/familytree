import Contact from '../../components/Contact'

// styles
import './Faq.css'

export default function Faq() {
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
                  This is a family friendly site. Please use the contact us form below
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
            <b>Photo and PDF size limitations</b>
            <ul>
              <li>The size limitations on file uploads are in place because
                Google only provides a certain amount of free file storage. 
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
                  larger photos, please use
                  the Contact form below. 
              </li>
            </ul>
        </div>
        <br></br>
        <div>
            
            <Contact />
        </div>

    </div>
  )
}

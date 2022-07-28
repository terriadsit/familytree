// display terms and conditions as a dropdown
// called by <FAQ /> and <Signup />

import { useState } from 'react'

// styles
import './TermsAndConditions.css'

export default function TermsAndConditions() {


    
  const [show, setShow] = useState(false)

  const handleClick = () => {
    setShow(prev => !prev)
  }
  return (
    <div className='dropdown'>
        <h4 className='trigger' cy-test-id="terms-trigger" onClick={handleClick}>Click to view or hide Terms and Conditions</h4>
        {show && 
          <ul className='content' cy-test-id="terms-content">
            <li>
                We don't sell your personal information.
            </li>
            <li>
               Users agree to use the same name that you use in everyday life. 
            </li>
            <li>
                Users agree to create only one account (your own)
            </li>
            <li>
                Users agree to not share passwords or give access to your account to others.
            </li>
            <li>
                Users must be over 13 years old and not a convicted sex offender.
            </li>
            <li>
                Users will not share inappropriate material.
            </li>
            <li>
                Users will not share private material that infringes or violates someone else's rights.
            </li>
            <li>
                Users will abide by copyright laws.
            </li>
            <li>
                Users will not upload viruses or malicious code or do anything that could disable, overburden or impare the proper working of this application.
            </li>
            <li>
                Users may not access or collect data from this site using automated means or attempt to access data you do not have permission to access.
            </li>
            <li>
                Family Tree and Archive reserves the right to remove content that violates these provisions.
            </li>
            <li>
                Users agree to give permission to share the content that they create with other users for the purposes of viewing on this site.
            </li>
            <li>
               Users understand that these terms may be updated on occasion. 
            </li>
            <li>
                Users understand that this servise is proved "as is" with no guarantees that they will always be safe, secure, or error-free, or that they will function without disruptions, delays or imperfections. To 
                the extent permitted by law, we also DISCLAIM ALL WARRANTIES, WHETHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR
                PURPOSE, TITLE, AND NONINFRINGEMENT. We do not control or direct what people and others do
                or say, and we are not responsible for their actions or conduct or any content they share. Our liability shall be limited to the
                fullest extent permitted by applicable law, and under no circumstance will we be liable to you
                for any lost profits, revenues, information, or data, or consequential, special, indirect, exemplary,
                punative, or incidental damages arising out of or related to these Terms. Our aggregate
                liability arising out of or relating to these Terms will not exceed the greater of 
                $100 or the amount you have paid us in the past 12 months. 

            </li>
            <li>
                These Terms make up the entire agreement between you and Family Tree and Archive regarding
                your use of this product.
            </li>
            <li>
                If any portion of these Terms is found to be unenforceable, the remaining portion will remain in full force and effect. If we fail to
                enforce any of these Terms, it will not be considered a waiver. 
            </li>
            <li>
                We reserve all rights not expressly granted to you.
            </li>
        </ul>}
    </div>
  )
}

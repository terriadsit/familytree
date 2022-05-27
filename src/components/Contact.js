// provide ability for users to email admin
import  { useRef, useState } from 'react';
import emailjs from 'emailjs-com';

// styles 
import './Contact.css'

export default function Contact() {
  const [showResponse, setShowResponse] = useState(false)
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('gmail', 'template_zko4opp', e.target, 'NS-1W3jYfqefnM0yg')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
    e.target.reset()
    setShowResponse(true)

  };

  return (
    <form className="contact-form" ref={form} onSubmit={sendEmail}>
      {showResponse && 
        <div className="response">
          Thank you for your email!
        </div>
      }
      <h4>Contact Us:</h4>
      <label>Name</label>
      <input type="text" name="name" onChange={() => setShowResponse(false)}/>
      <label>Email</label>
      <input type="email" name="email" />
      <label>Subject</label>
      <input type="text" name="subject" />
      <label>Message</label>
      <textarea name="message" />
      <input type="submit" className='btn' value="Send" />

    </form>
  );
};
// provide ability for users to email admin
import  { useRef } from 'react';
import { useSnackbar } from 'notistack'
import emailjs from 'emailjs-com';


// styles 
import './Contact.css'

export default function Contact() {
  const { enqueueSnackbar } = useSnackbar();
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
    enqueueSnackbar('Thank you for your message!', { 
      variant: 'success',
    });
   
  };

  return (
    <form className="contact-form" ref={form} onSubmit={sendEmail}>
      
      <label>Name</label>
      <input type="text" required name="name" />
      <label>Email</label>
      <input type="email" required name="email" />
      <label>Subject</label>
      <input type="text" required name="subject" />
      <label>Message</label>
      <textarea required name="message" />
      <input type="submit" className='btn' value="Send" />

    </form>
  );
};
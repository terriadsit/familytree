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
    //enqueueSnackbar('Thank you for your message!')

  };

  return (
    <form className="contact-form" ref={form} onSubmit={sendEmail}>
      <h4>Contact Us:</h4>
      <label>Name</label>
      <input type="text" name="name" />
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
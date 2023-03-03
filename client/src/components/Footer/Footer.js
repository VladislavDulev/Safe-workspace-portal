import React from "react";
import './Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

export default function FooterPage() {
  return (
    <footer className='footer mt-auto py-3 text-white footer-color'>
      <div className='container'>
      <ul>
         <li>
             <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
             <a href="https://www.facebook.com/vladislav.dulev" style={{color:'white', textDecoration:'none', padding:'5px'}}>Vladi</a>
         </li>
         <li>
             <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
             <a href="https://www.facebook.com/hypnotizedstefan" style={{color:'white', textDecoration:'none', padding:'5px'}}>Stefan</a>
         </li>
       </ul>
      </div>
    </footer>
  )
}
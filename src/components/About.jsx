import './about.css';
// import { Button } from './ui/button';

import { IconBrandFacebook, IconBrandInstagram, IconMail, IconBulb } from '@tabler/icons-react';
import { Tooltip } from "@nextui-org/react";


function About() {
  return (
    <div className='main-content' style={{width:"1140px", marginLeft:"30px"}}>
      <div className='upper'>
        <div className='titles'>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl mb-2">
            Transforming Concepts <br /> 
            <span className="inline-flex items-center mt-3">
              Into Solutions
              <IconBulb size={80} color='#ffc683' className="ml-10 " />
            </span>
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Our mission is to provide innovative solutions 
              to complex problems.  <br />We strive to be the best in our field.
            </p>
          
        </div>
        <img src="book.gif" alt="" className='pics-1' style={{ width: "400px", marginRight:"10px" }}/>
      </div>

      <div className='bottom'>
        <div>
          <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">Meet our <br /> Creative Team</h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            A group of college students who are passionate about <br />
            creating innovative solutions.
          </p>

        </div>

        <div className='background'>
          <img src="ischan.jpeg" alt="" className='profile'/>
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">kalbo Cantor</h4>
          <p className="text-sm text-muted-foreground">Backend Developer </p>
          <blockquote className="mt-4 border-l-2 pl-2 italic text-sm mb-8">"when doubt clouds your mind and fear blurs your path, focus on just taking the next step."</blockquote>
          <div className='socials'>
            
          <Tooltip showArrow={true} placement='bottom' content="Christian Cantor"  >
            <a href="https://www.facebook.com/christian.cantor.902">
                  <IconBrandFacebook color='#ffc683' size={30} style={{
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}/>
                </a>
          </Tooltip>

          <Tooltip showArrow={true} placement='bottom' content="Christian Cantor">
            <a href="www.instagram.com">
              <IconBrandInstagram color='#ffc683' size={30} style={{
                  marginRight: '15px',
                  cursor: 'pointer'
                }}/>
            </a>
            
          </Tooltip>

          <Tooltip showArrow={true} placement='bottom' content="cantorchristian117@gmail.com">
              <IconMail color='#ffc683' size={30} style={{
                cursor: 'pointer'
              }}/>
          </Tooltip>

          </div>
        </div>

        <div className='background'>
          <img src="nowl.jpeg" alt="" className='profile'/>
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">
            Noel Salazar
          </h4>
          <p className="text-sm text-muted-foreground">Fullstack Developer</p>
          <blockquote className="mt-4 border-l-2 pl-2 italic text-sm mb-8">"a hundred knots in the intestines of sorrow, seeking aspiration through ink and paper."</blockquote>
          <div className='socials'>
          <Tooltip showArrow={true} placement='bottom' content="Noel Salazar">
            <a href="https://www.facebook.com/profile.php?id=100063708997272">
                <IconBrandFacebook color='#ffc683' size={30} style={{
                  marginRight: '15px',
                  cursor: 'pointer'
                }}/>
              </a>
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="Noel Salazar">
              <a href="">
                <IconBrandInstagram color='#ffc683' size={30} style={{
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}/>
              </a>
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="theenderwolfadjourner@gmail.com">
                <IconMail color='#ffc683' size={30} style={{
                  cursor: 'pointer'
                }}/>
            </Tooltip>
          </div>
        </div> 

        <div className='background'>
          <img src="../../public/mar1.jpg" alt="" className='profile'/>
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mt-2">Jean Marianne Elica</h4>
          <p className="text-xs text-muted-foreground">Frontend Developer / Designer</p>
          <blockquote className="mt-4 border-l-2 pl-2 italic text-sm mb-8">"i'm not avoiding it beacuse it's wrong for them, i'm avoiding it because it's not right for me yet."</blockquote>
          <div className='socials'>
          <Tooltip showArrow={true} placement='bottom' content="Jean Marianne Elica" style={{fontSize:"10px"}}>
              <a href="https://www.facebook.com/jeanmarianne.elica.9">
                  <IconBrandFacebook color='#ffc683' size={30} style={{
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}/>
                </a>
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="@mar_nine">
              <a href="https://www.instagram.com/mar_nine_/?hl=en">
                <IconBrandInstagram color='#ffc683' size={30} style={{
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}/>
              </a>
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="myhuskimochi@gmail.com">
                <IconMail color='#ffc683' size={30} style={{
                  cursor: 'pointer'
                }}/>
            </Tooltip>
          </div>
        </div>


        <div className='background'>
          <img src="prof2.jpg" alt="" className='profile'/>
          <h4 className="scroll-m-20 text-base font-semibold tracking-tight mt-2" >Philippe Louis Garibay</h4>
          <p className="text-sm text-muted-foreground">Frontend Developer</p>
          <blockquote className="mt-4 border-l-2 pl-2 italic text-sm mb-8">"i think a soulmate is someone who will make you be the most "you" that you can possibly be"</blockquote>
          <div className='socials'>
          <Tooltip showArrow={true} placement='bottom' content="Philippe Garibay" >
              <a href="www.facebook.com">
                <IconBrandFacebook color='#ffc683' size={30} style={{
                  marginRight: '15px',
                  cursor: 'pointer'
                }}/>
              </a>
              
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="@iamfinethankyouandlou_">
              <a href="https://www.instagram.com/iamfinethankyouandlou_/?hl=en">
                <IconBrandInstagram color='#ffc683' size={30} style={{
                    marginRight: '15px',
                    cursor: 'pointer'
                  }}/>
              </a>
            </Tooltip>

            <Tooltip showArrow={true} placement='bottom' content="louisgaribay7000@gmail.com">
                <IconMail color='#ffc683' size={30} style={{
                  cursor: 'pointer'
                }}/>
            </Tooltip>
          </div>
        </div>


      </div>

      
    </div>
  );
}

export default About;

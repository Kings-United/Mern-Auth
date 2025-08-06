import React from 'react'
import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from './api'
import { useNavigate } from 'react-router-dom'

function login() {
    const navigate = useNavigate();
    const responseGoogle = async (authResult) => {
        try{
            console.log(authResult)
            if(authResult['code']){
                const result = await googleAuth(authResult['code'])
                const {email, name, image} = result.data.user;
                const obj = {
                    email,
                    name,
                    image
                };
                localStorage.setItem('user-info', JSON.stringify(obj));
                console.log(result.data.user);
                console.log(result.data.token);
                navigate('/dashboard');
              }
        }catch(error){
            console.log(error)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess:responseGoogle,
        onError: responseGoogle,
        flow:'auth-code'
    })

  return (
    <div className='login'>
      <h1>Login</h1>
      <button
      onClick={googleLogin}
      >Login</button>
    </div>
  )
}

export default login

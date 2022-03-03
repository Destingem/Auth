import { useRef } from 'react';
import { useReducer } from 'react';
import { useState } from 'react';
import classes from './AuthForm.module.css';
const randomstring = require("randomstring")
var apiKey = "AIzaSyCJzXKSHkDcocBIk-GRN5o1AAf8Mcm0PLI"

function errorReducer(state, action){
  console.log(action);
  if (Array.isArray(action)) {
    var errors = action.map((error)=> {
      console.log("A");
      switch (error.message) {
        case 'EMAIL_EXISTS':
          return {message:"Zadaný email je již registrován", id: 1}
          break;
        case 'WEAK_PASSWORD : Password should be at least 6 characters':
          return {message: "Krátké heslo, heslo musí být alespoň 6 znaků dlouhé.", id: 2}
        case 'EMAIL_NOT_FOUND':
          return "REDIRECT"
        default:
          console.log(action);
          return {message: action[0].message, id: 6}
          break;
      }
    })
  } else if (action == "SUCESS_REG"){
    var errors = {message: "Úspěšně zaregistrován", id: 14}
  } else if (action == "SUCESS_LOG") {
    var errors = {message: "Úspěšně přihlášen", id: 15}
  }
   else{
    var errors = ""
  }
  console.log(errors);
  return errors
}
const AuthForm = (props) => {
  const [isLogin, setIsLogin] = useState(props.loginOrSign);
  const [errors, setErrors] = useReducer(errorReducer, null)
  const emailRef = useRef()
  const passwordRef = useRef()
  const switchAuthModeHandler = () => {
    setErrors(null)
    setIsLogin((prevState) => !prevState);
  };
  function submitHandler(props){
    props.preventDefault()
    const emailInput = emailRef.current.value
    const passwordInput = passwordRef.current.value
    if (isLogin) {
       var url= "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
    } else {
      var url= "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
    }
    fetch(url + apiKey, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput,
          returnSecureToken: true
        })

      }).then(response => {
        if (response.ok) {
          if (isLogin) {
            setErrors("SUCESS_LOG")
          } else if (isLogin == false){
            setErrors("SUCESS_REG")
          }
          return response.json()
        } else{
          return response.json().then((data)=>{
            console.log(data)
            setErrors(data.error.errors)
          })
        }
      }).then(data => {
        console.log(data);
      })
  }

  return (
    <section className={classes.auth}>
    {errors ? errors[0] === "REDIRECT" ? <p key={randomstring.generate(7)} className={classes.error} onClick={switchAuthModeHandler}>Profil neexistuje, kliknutím přejdete za registraci</p>: null : null}
    {Array.isArray(errors) ? errors.map((error)=>{
      return <p key={error.id} className={classes.error}>{error.message}</p>
    }): null}
    {errors && !Array.isArray(errors) ? <p className={classes.error} key={errors.id}>{errors.message}</p> : null}
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordRef} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;

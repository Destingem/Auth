import AuthForm from '../components/Auth/AuthForm';

const AuthPage = (props) => {
  return <AuthForm loginOrSign={props.loginOrSign}/>;
};

export default AuthPage;

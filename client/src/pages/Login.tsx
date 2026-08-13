import {Link, useNavigate} from "react-router-dom";
import {useState } from "react";
import {loginUser} from "../api/auth.api";
import {useAuth} from "../context/AuthContext";

function Login(){

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const{setUser, setAccessToken} = useAuth();

    const navigate = useNavigate();
    const handleSubmit = async(event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        const response = await loginUser({email, password});
        const{accessToken, user} = response.data.data;
        setUser(user);
        setAccessToken(accessToken);
        navigate('/dashboard');
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type='email'
                placeholder='Enter your email address'
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                style={{padding: '0.75rem', border: '1px solid #ccc', borderRadius: '8px', width: '300px'}}
            /><br/><br/>

            <input
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(event)=>setPassword(event.target.value)}
                style={{padding: '0.75rem', border: '1px solid #ccc', borderRadius: '8px', width: '300px'}}
            /> <br/><br/>
            <button type='submit'>Login</button>
         
        <p>Don't have an account?{" "}
            <Link to="/register">Register</Link>
        </p>
            <h1>Login page</h1>
        </form>
    )
};

export default Login;

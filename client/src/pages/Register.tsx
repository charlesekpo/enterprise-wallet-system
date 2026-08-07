import {Link} from "react-router-dom";
function Register(){
    return (
        <>
        <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
        </p>
            <h1>Register page</h1>
        </>
    );
};

export default Register;
import { useRouteError,Link } from "react-router-dom";

 function NotFound() {
    const error = useRouteError();
    console.log(error);

     return (
       <div className="d-grid mt64 ji-center">
         <div className="grid--col">
           <h1>Oops!</h1>
           <p>Sorry, page not found.</p>
           <p>
             <i className="fc-danger">
               Error: {error.statusText || error.message}
             </i>
           </p>
           <p>
             <Link to="/login"> Login </Link>
           </p>
         </div>
       </div>
     );
 }

export default NotFound;
import React, { useContext, useEffect } from 'react'
import './Verify.css';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../../context/StoreContext';


const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderId = searchParams.get("orderId")
    const {url} = useContext(StoreContext);
    const navigate = useNavigate();

                     
    const verifyPayment = async () =>{
        // const response = await axios.get(url+"/api/order/verify", {success, orderId})
        const response = await axios.get(`${url}/api/order/verify?success=${success}&orderId=${orderId}`)
        if (response.data.success){
            navigate('/myorders');
        }
        else{
            navigate('/')
        }
    }

     useEffect(()=>{
         verifyPayment()
     },[])
  return (
    <div className='verify'>
        <div className="spinner">

        </div>

    </div>
  )
}

export default Verify
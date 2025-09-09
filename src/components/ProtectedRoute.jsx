import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [])


    return (
        <>
            <Outlet />
        </>
    )
}
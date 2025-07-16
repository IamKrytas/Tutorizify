import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";


export const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        const role = decoded.role || null;

        if (role) {
            localStorage.setItem("role", role);
        } else {
            console.error("Token does not contain a valid role");
        }
    }
    catch (error) {
        toast.error("Nieprawidłowy token. Proszę zalogować się ponownie.");
    }
};  
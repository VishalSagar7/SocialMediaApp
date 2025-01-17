import { useEffect } from "react"
import axios from "axios";
import { API_ENDPOINT } from "../../utils/constants";
import { useDispatch } from 'react-redux'
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUsers = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {

                const res = await axios.get(`${API_ENDPOINT}/api/v1/user/suggested`, { withCredentials: true });

                if (res?.data?.success) {
                    dispatch(setSuggestedUsers(res?.data?.suggestedUsers));
                };

            } catch (error) {
                console.log(error);

            }
        }

        fetchSuggestedUsers();

    }, []);
};


export default useGetSuggestedUsers;
import { useEffect } from "react"
import axios from "axios";
import { API_ENDPOINT } from "../../utils/constants";
import { useDispatch } from 'react-redux'
import { setSuggestedUsers } from "../redux/authSlice";
import { setUserProfile } from "../redux/authSlice";

const useGetUserProfile = (userId) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {

                const res = await axios.get(`${API_ENDPOINT}/api/v1/user/${userId}/profile`, { withCredentials: true });

                if (res?.data?.success) {
                    dispatch(setUserProfile(res?.data?.user));
                };

            } catch (error) {
                console.log(error);

            }
        }

        fetchUserProfile();

    }, [userId]);
};


export default useGetUserProfile;
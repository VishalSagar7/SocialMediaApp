import { useEffect } from "react"
import axios from "axios";
import { API_ENDPOINT } from "../../utils/constants";
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from "../redux/postSlice";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessages = () => {

    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchAllMesseges = async () => {
            try {

                const res = await axios.get(`${API_ENDPOINT}/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });

                
                
                if (res?.data?.success) {
                    dispatch(setMessages(res?.data?.messeges));
                    
                }

            } catch (error) {
                console.log(error);

            }
        }

        fetchAllMesseges();

    }, [selectedUser]);
};


export default useGetAllMessages;
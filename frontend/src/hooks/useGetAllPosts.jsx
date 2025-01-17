import { useEffect } from "react"
import axios from "axios";
import { API_ENDPOINT } from "../../utils/constants";
import { useDispatch } from 'react-redux'
import { setPosts } from "../redux/postSlice";

const useGetAllPosts = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {

                const res = await axios.get(`${API_ENDPOINT}/api/v1/post/getallposts`, { withCredentials: true });

                if (res?.data?.success) {
                    dispatch(setPosts(res?.data?.posts));
                }

            } catch (error) {
                console.log(error);

            }
        }

        fetchAllPosts();

    }, []);
};


export default useGetAllPosts;
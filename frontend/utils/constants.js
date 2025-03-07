// export const API_ENDPOINT = "http://localhost:3000";
export const API_ENDPOINT = "https://socialmediaapp-kmrw.onrender.com"

export const readFileAsDataUrl = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') resolve(reader.result)
        }
        reader.readAsDataURL(file);
    })
};
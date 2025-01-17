import jwt from 'jsonwebtoken';


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(401)
                .json({
                    message: 'User not authenticated.',
                    success: true,
                });
        };

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res
                .status(401)
                .json({
                    message: 'Invalid.',
                    success: true,
                });
        };
        
        req.id = decoded.userId;

        next();

    } catch (error) {
        console.log(error);
        
    };
};

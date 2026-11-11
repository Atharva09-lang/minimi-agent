import {createRemoteJWKSet, jwtVerify} from "jose";

const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
const baseUrl = process.env.NEON_AUTH_BASE_URL;

if(!jwksUrl || !baseUrl) {
    throw new Error("neon auth env variables are missing or not set");
}


const JWKS = createRemoteJWKSet(new URL(jwksUrl));
const issuer = new URL(baseUrl).origin;

export async function verifyToken(req,res,next){
    try{
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }

    const token = authHeader.slice(7);

    const{payload}= await jwtVerify(token, JWKS, {
        issuer,
        audience: "neondb"
    });

    if(typeof payload.sub !== "string" || !payload.sub){
        return res.status(401).json({
            success: false,
            error: "Unauthorized / Invalid"
        });
    }

    req.user = {
        id: payload.sub,
    }
    next();
  }catch(error){
    console.error("Authentication error:", error);
    return res.status(401).json({
        success: false,
        error: "Unauthorized / Invalid"
    });
  }
} 
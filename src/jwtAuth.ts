import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

export const generateJWTAuthentication = (jwksUri: string, audience: string, issuer: string): jwt.RequestHandler => {
  return jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri
    }),
    audience,
    issuer,
    algorithms: ['RS256']
  });
};

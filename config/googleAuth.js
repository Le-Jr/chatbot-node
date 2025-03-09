import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import dotenv from "dotenv";
import { Clients } from "../models/Clients.js";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"];

// console.log("Chave google: ", GOOGLE_CLIENT_ID);

// console.log("✅ googleAuth.js foi carregado!");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/client/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        console.log("Jailson mendes");
        let user = await Clients.findOne({ where: { googleId: profile.id } });

        if (!user) {
          const [newUser] = await Clients.findOrCreate({
            where: { googleId: profile.id },
            defaults: {
              name: profile.displayName,
              email: profile.email || "",
            },
          });
          user = newUser;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Salva apenas o ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Clients.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// console.log("✅ Estratégia do Google foi registrada no Passport!");

export default passport;

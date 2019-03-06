const User = require('../models/user.model');
const jwtsecret = "mysecretkey"; 

const jwt = require('jsonwebtoken');
const passport = require('koa-passport'); 
const LocalStrategy = require('passport-local'); 
const JwtStrategy = require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  function (email, password, done) {
    User.findOne({email}, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        return done(null, false, {message: 'User does not exist or wrong password.'});
      }
      return done(null, user);
    });
  }
  )
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: jwtsecret
  };
  
  passport.use(new JwtStrategy(jwtOptions, function (payload, done) {
      User.findById(payload.id, (err, user) => {
        if (err) {
          return done(err)
        }
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  );


async function createUser(ctx, next){
    try {
      //let user = await User.findOne({email: ctx.request.body.email});
      //if(user != void(0)){
      //  ctx.status = 400;
      //  ctx.message = "User already exist.";
      //}else 
        ctx.body = await User.create(ctx.request.body);
    }
    catch (err) {
      ctx.status = 400;
      ctx.body = err;
    }
}

async function login(ctx, next){
    await passport.authenticate('local', function (err, user) {
      if (user == false) {
        ctx.body = "Login failed";
      } else {
        //--payload - info to put in the JWT
        const payload = {
          id: user.id,
          displayName: user.displayName,
          email: user.email
        };
        const token = jwt.sign(payload, jwtsecret); //JWT is created here
  
        ctx.body = {user: user.displayName, token: 'JWT ' + token};
      }
    })(ctx, next);

}

async function checkLogin(ctx, next){

    await passport.authenticate('jwt', function (err, user) {
      if (user) {
        ctx.body = true;
      } else {
        ctx.body = false;
        console.log("err", err)
      }
    } )(ctx, next)
}

module.exports = { createUser, login, checkLogin };
  
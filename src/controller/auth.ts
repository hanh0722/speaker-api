import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User";
import { UserRequest } from "../types/user";
import {
  convertNormalPhoneToCountryCode,
  getToken,
  isEmail,
  isMobilePhone,
  randomNumberByRange,
} from "../utils/string";
import { sendEmail } from "../utils/mail";
import { sendSMS } from "../utils/sms";
import { JWT_KEY } from "../constants/key";
import { getUserResponse } from "../utils/response";

export const RegisterController: RequestHandler = async (req, res, next) => {
  const { username, password, name, info } = <UserRequest>req.body;

  if (!username || !password || !name || !info) {
    return res.status(401).json({
      message: "Not validation",
      code: 401,
    });
  }
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.status(422).json({
      message: validate.array()[0].msg,
      code: 422,
      errors: validate.array(),
    });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = new User({
      username,
      password: hash,
      is_validation: false,
      name: name,
      info: info,
    });
    await user.save();

    res.json({
      message: "succesfully",
      code: 200,
    });
  } catch (err: any) {
    next(err);
  }
};

export const SendOTPController: RequestHandler = async (req, res, next) => {
  const { username, validate_info } = req.body as UserRequest;

  if (!username || !validate_info) {
    return res.status(401).json({
      message: "Not valid information",
      code: 401,
    });
  }
  const validate = validationResult(req);
  if (!validate.isEmpty()) {
    return res.json({
      message: validate.array()[0].msg,
      code: 422,
      errors: validate.array(),
    });
  }

  try {
    const user = await User.findOne({ username: username });
    const otp = randomNumberByRange(100000, 999999);
    if (user) {
      if (isEmail(validate_info)) {
        const sendMailToUser = await sendEmail({
          to: validate_info,
          subject: "OTP for validate account",
          text: "Thank you for register your account in our service",
          html: `<p style="text-align: center">OTP for validate account: ${otp}</p>`,
        });
        console.log(sendMailToUser);
      } else {
        const sendSMSToUser = await sendSMS({
          body: `OTP for validate account ${otp}`,
          to: convertNormalPhoneToCountryCode(validate_info)!,
        });
        console.log(sendSMSToUser);
      }
      user.validate_info = {
        otp: otp,
        time_expiration: Date.now() + 5 * 60 * 1000,
        token_email: isEmail(validate_info) ? v4() : undefined,
      };
      user.is_validation = true;
      await user.save();
      return res.json({
        message: `send otp successfully to ${username}, otp will expire after 5 minutes`,
        code: 200,
      });
    }
    res.status(403).json({
      message: "not validation",
      code: 403,
    });
  } catch (err: any) {
    next(err);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body as UserRequest;
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.json({
      message: validation.array()[0].msg,
      code: 401,
      errors: validation.array(),
    });
  }
  try {
    const response = {
      message: "Username or password is not correct",
      code: 422,
    };
    const user = await User.findOne({ username: username }).populate([
      'compare_list',
      'address'
    ]);
    if (!user) {
      return res.status(422).json(response);
    }
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
      return res.status(403).json(response);
    }
    if (user && !user?.is_validation) {
      return res.status(403).json({
        message: "Your account is not validate, please validate first",
        code: 403,
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_KEY,
      {
        expiresIn: "24h",
      }
    );
    res.json({
      code: 200,
      message: "successfully",
      token: token,
      user: getUserResponse(user),
      exp_time: Date.now() + 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    next(err);
  }
};

export const loginByTokenController: RequestHandler = async (
  req,
  res,
  next
) => {
  const header = req.headers["authorization"];
  try {
    const token = getToken(header);
    if (token) {
      const parsedToken = jwt.decode(token) as {
        id: string;
        user: string;
        exp: number;
      };
      const user = await User.findById(parsedToken.id).populate([
        'compare_list',
        'address'
      ]);
      if (user) {
        req.userId = user._id;
        req.username = user.username;
        return res.json({
          message: "successfully",
          code: 200,
          user: getUserResponse(user),
          token: token,
          exp_time: parsedToken.exp * 1000,
        });
      }
    }
  } catch (err) {
    next();
  }
  next();
};

export const validateOTPController: RequestHandler = async (req, res, next) => {
  const { username, otp } = req.body as UserRequest;
  try {
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(422).json({
        message: validation.array()[0].msg,
        code: 422,
        errors: validation.array(),
      });
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({
        message: "User is not existed",
        code: 404,
      });
    }
    if (user?.validate_info) {
      const otpBefore = user?.validate_info?.otp;
      const time_expiration = user?.validate_info?.time_expiration;
      if (otpBefore !== otp) {
        return res.status(401).json({
          message: "OTP is not matched!",
          code: 401,
        });
      }
      if (Date.now() > time_expiration) {
        return res.status(400).json({
          message: "OTP is expired! please send other otp",
          code: 400,
        });
      }
      user.validate_info = undefined;
      await user.save();
      return res.json({
        message: "successfully",
        code: 200,
      });
    }
    res.status(500).json({
      message: "Server Internal Error",
      code: 500,
    });
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController: RequestHandler = async (req, res, next) => {
  const { username } = req.body as UserRequest;
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(422).json({
      message: validation.array()[0].msg,
      code: 422,
      errors: validation.array()
    })
  };
  try{
    const user = await User.findOne({username: username});
    if (!user) {
      return res.status(401).json({
        message: 'User is not valid',
        code: 401
      })
    };
    const otp = randomNumberByRange(100000, 999999);
    const infoUser = user.info;
    if (isEmail(infoUser)) {
      const mail = await sendEmail({
        to: infoUser,
        subject: "OTP for reset password",
        text: "Don't public this otp for anyone",
        html: `<p style="text-align: center">OTP for reset account: ${otp}</p>`,
      })
    } else if(isMobilePhone(infoUser)) {
      const sms = await sendSMS({
        body: `OTP for reset password: ${otp}`,
        to: convertNormalPhoneToCountryCode(infoUser)!,
      });
    }
    user.validate_info = {
      time_expiration: Date.now() + 5 * 60 * 60 * 1000,
      otp: otp
    };
    await user.save();

    res.json({
      message: `successfully sent otp to ${infoUser}`,
      code: 200
    })
    
  }catch(err) {
    next(err);
  }
};

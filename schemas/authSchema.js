import joi from "joi"

export const authSignUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.ref('password')
});

export const authSignInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().required()
});
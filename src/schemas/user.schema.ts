import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({ required_error: 'Name is required' }),
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    phone: string({ required_error: 'Phone is required' }),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email or password'
    ),
    password: string({ required_error: 'Password is required' }).min(
      8,
      'Invalid email or password'
    ),
  }),
});

export const resetPasswordRequestSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(
      'Invalid email'
    ),
    token: string({ required_error: 'Token is required' }),
    password: string({ required_error: 'Password is required' })
      .min(8, 'Password must be more than 8 characters')
      .max(32, 'Password must be less than 32 characters'),
    passwordConfirm: string({ required_error: 'Please confirm your password' }),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];
export type ResetPasswordRequestInput = TypeOf<typeof resetPasswordRequestSchema>['body'];

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useState } from "react";

import { useForm } from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import toast from "react-hot-toast";


import {
  resetPasswordSchema,
} from "../../utils/validation";


import {
  resetPassword,
} from "../../api/auth.api";


import FormField
  from "../../components/forms/FormField";

import PasswordField
  from "../../components/forms/PasswordField";

import Button
  from "../../components/ui/Button";


export default function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();


  const token =
    searchParams.get("token");


  const [passwordReset, setPasswordReset] =
    useState(false);


  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({

    resolver:
      zodResolver(
        resetPasswordSchema
      ),

  });


  // ==========================================
  // RESET PASSWORD
  // ==========================================

  const onSubmit = async (data) => {

    try {

      const response =
        await resetPassword(

          token,

          data.password

        );


      toast.success(

        response.message ||

        "Password reset successfully."

      );


      setPasswordReset(true);


    } catch (error) {

      const message =

        error?.response?.data?.message ||

        "Unable to reset password.";


      toast.error(message);

    }

  };


  // ==========================================
  // INVALID TOKEN
  // ==========================================

  if (!token) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-6">

          ⚠️

        </div>


        <h1 className="
          text-2xl
          font-bold
          text-red-500
        ">

          Invalid Reset Link

        </h1>


        <p className="
          mt-3
          text-slate-500
        ">

          This password reset link is invalid
          or has expired.

        </p>


        <Link
          to="/forgot-password"
          className="
            text-emerald-600
            font-semibold
            mt-6
            inline-block
          "
        >

          Request a new link

        </Link>

      </div>

    );

  }


  // ==========================================
  // SUCCESS STATE
  // ==========================================

  if (passwordReset) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-6">

          🎉

        </div>


        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">

          Password Reset Successfully!

        </h1>


        <p className="
          mt-4
          text-slate-500
        ">

          Your password has been changed
          successfully.

        </p>


        <p className="
          mt-2
          text-sm
          text-slate-500
        ">

          You can now log in using your new password.

        </p>


        <div className="mt-8">

          <Button
            onClick={() =>
              navigate("/login")
            }
          >

            Continue to Login

          </Button>

        </div>

      </div>

    );

  }


  // ==========================================
  // RESET PASSWORD FORM
  // ==========================================

  return (

    <>

      <div className="mb-8">

        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">

          Reset Password

        </h1>


        <p className="
          mt-2
          text-slate-500
        ">

          Create a new password for your account.

        </p>

      </div>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <FormField
          label="New Password"
          error={errors.password?.message}
          required
        >

          <PasswordField
            register={register("password")}
            placeholder="Enter new password"
          />

        </FormField>


        <FormField
          label="Confirm Password"
          error={
            errors.confirmPassword?.message
          }
          required
        >

          <PasswordField
            register={
              register("confirmPassword")
            }
            placeholder="Confirm password"
          />

        </FormField>


        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >

          Reset Password

        </Button>

      </form>

    </>

  );

}
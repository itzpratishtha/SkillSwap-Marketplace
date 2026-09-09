import { Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  forgotPasswordSchema,
} from "../../utils/validation";

import {
  forgotPassword,
} from "../../api/auth.api";

import FormField from "../../components/forms/FormField";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


export default function ForgotPassword() {

  const [emailSent, setEmailSent] =
    useState(false);

  const [submittedEmail, setSubmittedEmail] =
    useState("");


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
        forgotPasswordSchema
      ),

  });


  // ==========================================
  // SEND RESET LINK
  // ==========================================

  const onSubmit = async (data) => {

    try {

      const response =
        await forgotPassword(
          data.email
        );


      setSubmittedEmail(
        data.email
      );


      setEmailSent(true);


      toast.success(

        response.message ||

        "Password reset link sent successfully."

      );


    } catch (error) {

      const message =

        error.response?.data?.message ||

        "Unable to send reset link.";


      toast.error(message);

    }

  };


  // ==========================================
  // SUCCESS / CHECK INBOX STATE
  // ==========================================

  if (emailSent) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-6">

          📧

        </div>


        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">

          Check Your Inbox

        </h1>


        <p className="
          mt-5
          text-slate-500
        ">

          If an account exists with this email,
          we've sent a password reset link.

        </p>


        <p className="
          mt-2
          font-semibold
          text-emerald-600
          break-all
        ">

          {submittedEmail}

        </p>


        <p className="
          mt-6
          text-sm
          text-slate-500
        ">

          Click the reset link in your email
          to create a new password.

        </p>


        <div className="mt-8">

          <Link to="/login">

            <Button>

              Back to Login

            </Button>

          </Link>

        </div>

      </div>

    );

  }


  // ==========================================
  // FORGOT PASSWORD FORM
  // ==========================================

  return (

    <>

      <div className="mb-8">

        <h1 className="
          text-3xl
          font-bold
          text-slate-800
        ">

          Forgot Password

        </h1>


        <p className="
          mt-2
          text-slate-500
        ">

          Enter your registered email to receive
          a password reset link.

        </p>

      </div>


      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <FormField
          label="Email"
          error={errors.email?.message}
          required
        >

          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />

        </FormField>


        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >

          Send Reset Link

        </Button>

      </form>


      <p className="
        mt-8
        text-center
        text-sm
        text-slate-600
      ">

        Remember your password?{" "}

        <Link
          to="/login"
          className="
            font-semibold
            text-emerald-600
            hover:underline
          "
        >

          Login

        </Link>

      </p>

    </>

  );

}
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import {
  resendVerificationEmail,
} from "../../api/auth.api";


export default function CheckInbox() {

  const location = useLocation();

  const email = location.state?.email || "";

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResend = async () => {

    if (!email) {

      toast.error(
        "Email not found. Please register again or login."
      );

      return;

    }


    try {

      setLoading(true);

      const response =
        await resendVerificationEmail(email);


      toast.success(

        response.message ||
        "Verification email sent successfully."

      );

    } catch (error) {

      const message =

        error.response?.data?.message ||

        "Unable to resend verification email.";


      toast.error(message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="text-center">

      {/* ICON */}

      <div className="text-6xl mb-6">

        📬

      </div>


      {/* HEADING */}

      <h1 className="text-3xl font-bold text-slate-800">

        Check Your Inbox

      </h1>


      {/* EMAIL MESSAGE */}

      <p className="mt-5 text-slate-500">

        We've sent a verification email to

      </p>


      <p className="
        mt-2
        font-semibold
        text-emerald-600
        break-all
      ">

        {email}

      </p>


      <p className="mt-6 text-sm text-slate-500">

        Click the verification link in your email
        to activate your account.

      </p>


      {/* RESEND BUTTON */}

      <div className="mt-8">

        <Button
          onClick={handleResend}
          loading={loading}
        >

          Resend Verification Email

        </Button>

      </div>


      {/* BACK TO LOGIN */}

      <div className="mt-5">

        <Link to="/login">

          <Button
            type="button"
          >

            Back to Login

          </Button>

        </Link>

      </div>

    </div>

  );

}
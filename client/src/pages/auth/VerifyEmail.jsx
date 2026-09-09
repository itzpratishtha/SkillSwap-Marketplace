import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";

import {
  resendVerificationEmail,
  verifyEmail,
} from "../../api/auth.api";


export default function VerifyEmail() {

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const token = params.get("token");

  const email = location.state?.email || "";


  const [loading, setLoading] = useState(false);

  const [verifying, setVerifying] = useState(
    Boolean(token)
  );

  const [verified, setVerified] = useState(false);

  const [verificationError, setVerificationError] =
    useState("");


  // ==========================================
  // VERIFY EMAIL WHEN TOKEN IS IN URL
  // ==========================================

  useEffect(() => {

    const verifyUserEmail = async () => {

      if (!token) return;

      try {

        setVerifying(true);

        setVerificationError("");

        const response =
          await verifyEmail(token);

        if (response.success) {

          setVerified(true);

          toast.success(
            response.message ||
            "Email verified successfully!"
          );

        }

      } catch (error) {

        const message =
          error.response?.data?.message ||
          "Verification link is invalid or has expired.";

        setVerificationError(message);

      } finally {

        setVerifying(false);

      }

    };


    verifyUserEmail();

  }, [token]);


  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResend = async () => {

    if (!email) {

      toast.error(
        "Email not found. Please login and request verification again."
      );

      return;

    }


    try {

      setLoading(true);

      const response =
        await resendVerificationEmail({
          email,
        });

      toast.success(

        response.message ||
        "Verification email sent successfully."

      );

    } catch (error) {

      const message =

        error.response?.data?.message ||

        "Something went wrong. Please try again.";


      toast.error(message);

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // VERIFYING STATE
  // ==========================================

  if (verifying) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-4">
          ⏳
        </div>


        <h1 className="text-3xl font-bold text-slate-800">

          Verifying your email...

        </h1>


        <p className="mt-4 text-slate-500">

          Please wait while we verify your email address.

        </p>

      </div>

    );

  }


  // ==========================================
  // SUCCESS STATE
  // ==========================================

  if (verified) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-4">

          🎉

        </div>


        <h1 className="text-3xl font-bold text-slate-800">

          Email Verified!

        </h1>


        <p className="mt-4 text-slate-500">

          Your email has been verified successfully.

        </p>


        <p className="mt-2 text-sm text-slate-500">

          You can now log in to your SkillSwap account.

        </p>


        <div className="mt-8">

          <Link to="/login">

            <Button>

              Continue to Login

            </Button>

          </Link>

        </div>

      </div>

    );

  }


  // ==========================================
  // ERROR STATE
  // ==========================================

  if (verificationError) {

    return (

      <div className="text-center">

        <div className="text-6xl mb-4">

          ⚠️

        </div>


        <h1 className="text-3xl font-bold text-slate-800">

          Verification Failed

        </h1>


        <p className="mt-4 text-red-500">

          {verificationError}

        </p>


        <p className="mt-4 text-sm text-slate-500">

          The verification link may have expired.
          You can request a new verification email.

        </p>


        <div className="mt-8">

          <Button
            onClick={handleResend}
            loading={loading}
          >

            Resend Verification Email

          </Button>

        </div>


        <p className="mt-8 text-sm text-slate-600">

          <Link
            to="/login"
            className="
              font-semibold
              text-emerald-600
              hover:underline
            "
          >

            Back to Login

          </Link>

        </p>

      </div>

    );

  }


  // ==========================================
  // NORMAL CHECK-INBOX STATE
  // ==========================================

  return (

    <div className="text-center">

      <div className="mb-8">

        <div className="text-6xl mb-4">

          📧

        </div>


        <h1 className="text-3xl font-bold text-slate-800">

          Verify your email

        </h1>


        <p className="mt-4 text-slate-500">

          We've sent a verification link to

        </p>


        <p className="
          font-semibold
          text-emerald-600
          mt-2
          break-all
        ">

          {email}

        </p>


        <p className="mt-6 text-sm text-slate-500">

          Please check your inbox and click the
          verification link before logging in.

        </p>

      </div>


      <Button
        onClick={handleResend}
        loading={loading}
      >

        Resend Verification Email

      </Button>


      <p className="mt-8 text-sm text-slate-600">

        Already verified?{" "}

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

    </div>

  );

}
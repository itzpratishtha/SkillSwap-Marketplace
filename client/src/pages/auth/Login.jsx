import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { loginSchema } from "../../utils/validation";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../contexts/AuthContext";

import FormField from "../../components/forms/FormField";
import PasswordField from "../../components/forms/PasswordField";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

login(response.user);

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch (error) {

    const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

    alert(message);

}
  };

  return (
    <>
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-slate-500">
          Login to continue your learning journey.
        </p>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          label="Email"
          error={errors.email?.message}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Password"
          error={errors.password?.message}
        >
          <PasswordField
            placeholder="Enter password"
            register={register("password")}
          />
        </FormField>

        <div className="flex justify-end">

          <Link
            to="/forgot-password"
            className="text-sm text-emerald-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          className="w-full"
        >
          Login
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </>
  );
}
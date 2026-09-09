import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { registerSchema } from "../../utils/validation";
import { registerUser } from "../../api/auth.api";

import FormField from "../../components/forms/FormField";
import Input from "../../components/ui/Input";
import PasswordField from "../../components/forms/PasswordField";
import Button from "../../components/ui/Button";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      const response = await registerUser(payload);

      toast.success(
        response.message || "Registration successful!"
      );

      navigate("/check-inbox", {
        state: {
          email: data.email,
        },
      });
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
          Create Account
        </h1>

        <p className="mt-2 text-slate-500">
          Start your learning journey today.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          label="Full Name"
          error={errors.name?.message}
          required
        >
          <Input
            placeholder="Enter your full name"
            {...register("name")}
          />
        </FormField>

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

        <FormField
          label="Password"
          error={errors.password?.message}
          required
        >
          <PasswordField
            register={register("password")}
            placeholder="Create a password"
          />
        </FormField>

        <FormField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          required
        >
          <PasswordField
            register={register("confirmPassword")}
            placeholder="Confirm your password"
          />
        </FormField>
        <FormField
  label="Role"
  error={errors.role?.message}
  required
>
  <select
    {...register("role")}
    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-emerald-500 focus:outline-none"
  >
    <option value="">Select your role</option>

    <option value="Student">Student</option>

    <option value="Mentor">Mentor</option>

    <option value="Freelancer">Freelancer</option>

    <option value="Professional">Professional</option>
  </select>
</FormField>

        <Button
          type="submit"
          loading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-emerald-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </>
  );
}
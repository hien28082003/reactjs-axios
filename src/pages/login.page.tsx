import { object, string, TypeOf } from "zod";
import { useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";
import { ILoginResponse } from "../api/types";
import { authApi } from "../api/authApi";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const store = useStore();
  const navigate = useNavigate();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const loginUser = async (data: LoginInput) => {
    try {
      store.setRequestLoading(true);
      await authApi.post<ILoginResponse>("/auth/login", data);
      store.setRequestLoading(false);
      navigate("/profile");
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };
  return (
    <section className="bg-gradient-to-t from-ct-f to-ct-t">
      <div className="w-full">
        
        <FormProvider {...methods}>
          
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-100 rounded-2xl p-8 space-y-5"
          >
            <h1 className="text-4xl xl:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
        <Link to="/" >
              JAPPER
            </Link>
        </h1>
       <h2 className="text-lg text-center mb-4 text-ct-blue-600">
          Login to have access
        </h2>
            <FormInput label="Email" name="email" type="email" />
            <FormInput label="Password" name="password" type="password" />

            <div className="text-right text-ct-blue-600">
              <Link to="/forgotpassword" className="">
                Forgot Password?
              </Link>
            </div>
            <LoadingButton
              loading={store.requestLoading}
              textColor="text-ct-blue-600"
            >
              Login
            </LoadingButton>
            <span className="block">
              Need an account?{" "}
              <Link to="/register" className="text-ct-blue-600">
                Sign Up Here
              </Link>
            </span>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default LoginPage;

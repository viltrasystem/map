import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import FormRowVertical from "../../ui/FormRowVertical";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import SpinnerMini from "../../ui/SpinnerMini";
import { toast } from "react-toastify";
import { TLoginSchema, loginSchema } from "../../lib/types";
import ErrorTxt from "../../ui/ErrorTxt";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { RootState } from "../../app/store";
import { login } from "../../thunk/authThunk";
import Heading from "../../ui/Heading";
import Logo from "../../ui/Logo";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToastOptions, isEmpty } from "../../lib/helpFunction";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Update mode to validate on blur
  });
  const location = useLocation();
  const from = location.state?.from;
  // Once authenticated, navigate back to the originally accessed route
  console.log(errors.username, !errors.username);
  const dispatch = useAppDispatch();
  const { token, user, isLoading, error, isError } = useAppSelector(
    (state: RootState) => state.auth
  );
  const { rootId, unitId, currentUserId, municipality, mainNo, subNo } =
    useAppSelector((state: RootState) => state.mapping);

  const labelClasses: string =
    "pointer-events-none flex h-full w-full select-none text-sm font-normal text-gray-800";
  // "absolute left-0 -top-3.5 text-neutral-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-800 peer-focus:text-sm";
  const inputClasses: string =
    "h-full w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 font-sans text-sm font-normal text-gray-700 outline outline-0 transition-all focus:placeholder-opacity-0 focus:border-customBlue  focus:outline-0 disabled:border-0";
  // "peer h-10 w-full border-b-2 border-gray-300 text-gray-900 input-modified bg-transparent placeholder-transparent focus:outline-none focus:border-blue-600 bg-transparent";
  // const errorLineClasses: string =
  //   "absolute right-0 top-10 inline-block sm:right-0 sm:-top-3.5 text-rose-600 text-sm";
  const errorClasses: string = "inline-block text-rose-600 text-xs";

  const onSubmit: SubmitHandler<TLoginSchema> = async (data) => {
    dispatch(login(data));
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (token && token.accessToken != "" && user.UserId != 0) {
      const decodedToken = jwtDecode(token.accessToken);
      const expiryDate = decodedToken?.exp
        ? new Date(decodedToken?.exp * 1000)
        : null;
      if (expiryDate) {
        const currentDate = new Date();
        if (currentDate < expiryDate) {
          console.log(
            "Token is valid, redirect to dashboard until: " + expiryDate
          );
          console.log(
            rootId,
            unitId,
            currentUserId,
            municipality,
            mainNo,
            subNo,
            "rootId, unitId, currentUserId, municipality, mainNo, subNo "
          );

          if (user.UserId === currentUserId) {
            navigate("/land_selector");
          } else if (from) {
            navigate(from, { replace: true });
          } else {
            navigate("/dashboard");
          }
        }
      }
    }
  }, [token, user, navigate, dispatch]);

  useEffect(() => {
    if (isError) {
      if (error.statusCode !== 401)
        toast.error(error.errorMsg!, {
          ...getToastOptions,
          position: "top-center",
          theme: "light",
        });
    }
  }, [isError, error]);

  // if (isAuthenticated && !tokenValidity)
  return (
    <main className="flex h-screen min-h-screen content-center justify-center items-center bg-neutral-100 dark:bg-neutral-100 shadow-2xl">
      <section className="h-full bg-neutral-100 max-w-5xl">
        <div className="h-full p-10">
          <div className="gap-6 flex h-full flex-wrap items-center justify-center text-neutral-800 font-light">
            <div className="w-full">
              <div className="block rounded-lg bg-white shadow-lg">
                <div className="g-0 md:flex md:flex-wrap">
                  <div className="px-4 sm:px-0 md:w-6/12">
                    <div className="sm:mx-6 sm:p-12 sm:pt-4 p-4 h-8/12 sm:h-full">
                      <div className="flex gap-1 flex-col items-center text-center bg-logo">
                        <Logo size={100} />
                        <div className="text-gradient mb-4">
                          <Heading
                            headingElement="h4"
                            headingTxt="Viltrapporten Map"
                          />
                        </div>
                      </div>
                      <>
                        <form
                          className="mt-6"
                          onSubmit={handleSubmit(onSubmit)}
                          noValidate
                        >
                          <p className="pb-4">Please login to your account</p>
                          <div>
                            {isEmpty(errors) &&
                              error &&
                              error.statusCode === 401 && (
                                <ErrorTxt
                                  classes={errorClasses}
                                >{`${error.errorMsg} please check credential and try agains`}</ErrorTxt>
                              )}
                          </div>
                          <FormRowVertical
                            label="User Name"
                            error=""
                            name="username"
                            errorClasses=""
                            labelClasses={labelClasses}
                          >
                            <Input
                              id="username"
                              name="username"
                              type="text"
                              className={`${inputClasses} ${
                                errors.username?.message && "border-rose-400"
                              }  ${!errors.username && "border-customBlue"} `}
                              placeholder="User Name"
                              register={register}
                              disabled={isLoading}
                              required
                            />
                            {errors.username && (
                              <ErrorTxt classes={errorClasses}>
                                {errors.username.message}
                              </ErrorTxt>
                            )}
                          </FormRowVertical>
                          <FormRowVertical
                            label="Password"
                            error=""
                            name="password"
                            errorClasses=""
                            labelClasses={labelClasses}
                          >
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              className={`${inputClasses} ${
                                errors.password?.message && "border-rose-400"
                              }  ${!errors.password && "border-customBlue"} `}
                              placeholder="Password"
                              register={register}
                              disabled={isLoading}
                              required
                            />
                            {errors.password && (
                              <ErrorTxt classes={errorClasses}>
                                {errors.password.message}
                              </ErrorTxt>
                            )}
                          </FormRowVertical>
                          <Button type="submit" disabled={isLoading}>
                            {!isLoading ? (
                              "Log in"
                            ) : (
                              <div className="grid grid-flow-col justify-items-end">
                                <p>Log in</p>
                                <p>
                                  <SpinnerMini />
                                </p>
                              </div>
                            )}
                          </Button>
                        </form>
                      </>
                      <DevTool control={control} />
                    </div>
                  </div>
                  <div className="flex items-center rounded-b-lg md:w-6/12 md:rounded-r-lg md:rounded-bl-none background-gradient">
                    <div className="px-3 py-6 text-white sm:mx-6 sm:p-8">
                      <h4 className="mb-6 text-xl font-semibold">
                        Observation/Hunting lands & statistics
                      </h4>
                      <p className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod te Lorem ipsum dolor sit amet
                        consectetur adipisicing elit. Optio corrupti tenetur
                        debitis quae tempora commodi sequi id. Laboriosam
                        facilis consequuntur nobis dicta totam distinctio omnis
                        quia dolorum ab expedita quisquam error voluptatum quasi
                        doloremque ipsam cupiditate labore a reiciendis
                        voluptatibus, aspernatur, aliquam dignissimos?
                        Consectetur perferendis ad aspernatur consequatur,
                        debitis ab?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginForm;

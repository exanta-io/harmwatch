'use client';
import { useState } from 'react';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ExantaLogo from '../../components/icons/ExantaLogo';
import { HidePasswordIcon, ShowPasswordIcon } from '@/components/icons';

export default function LoginPage() {
  const router = useRouter();
  const [hasErrors, setHasErrors] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  // check if cookie currentUserHash is equal to NEXT_PUBLIC_HASH and if is set redirect to /conversations
if (typeof window !== 'undefined') {
  const currentUserHash = document.cookie
    .split('; ')
    .find((row) => row.startsWith('currentUserHash='))
    ?.split('=')[1];

  if (currentUserHash === process.env.NEXT_PUBLIC_HASH) {
    window.location.href = '/conversations';
  }
}

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    if (
      username === process.env.NEXT_PUBLIC_USERNAME &&
      password === process.env.NEXT_PUBLIC_PASSWORD
    ) {
      document.cookie = `currentUserHash=${process.env.NEXT_PUBLIC_HASH}`;
      router.push('/conversations');
      return;
    } else {
      setHasErrors(true);
    }
  }



  return (
    <div className="min-h-screen w-screen bg-base-300 p-10">
      <ExantaLogo />
      <div className="flexi absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-base-200 font-normal tracking-slight rounded-lg">
        <div className="flex w-[27.5rem] max-w-xl flex-col items-center justify-start rounded-xl border border-[rgba(50,54,69,0.44)]  px-6 py-5 shadow-md">
          <form
            className="flex w-full flex-col space-y-6 border-solid border-[#E6E6E6] text-left text-base"
            onSubmit={handleSubmit}
          >
            {hasErrors && (
              <div
                className="-my-3 ml-2 text-center font-normal tracking-light text-red-500"
                data-testid="error-message"
              >
                Please check your username and password and try again.
              </div>
            )}
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                type="text"
                name="username"
                className="grow"
                placeholder="Username"
              />
            </label>
            <label className="relative flex input w-full input-bordered items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type={hidePassword ? 'password' : 'text'}
                name="password"
                className="grow pr-10"
                placeholder="Password"
              />
              <button
                className="absolute top-1/2 right-3 transform -translate-y-1/2 focus-visible:outline-none"
                onClick={() => {
                  setHidePassword((previousState) => !previousState);
                }}
                type="button"
              >
                {hidePassword ? (
                  <HidePasswordIcon className="fill-dark-gray-5" />
                ) : (
                  <ShowPasswordIcon className="fill-dark-gray-5" />
                )}
              </button>
            </label>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

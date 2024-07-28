import React from 'react';
import { useStoreDisplaySettings } from '@/store';
import { useRouter } from 'next/navigation';
import ExantaLogo from './icons/ExantaLogo';
import { SignOut, Info } from '@phosphor-icons/react';

export const Navbar: React.FC = () => {
  const { isSidebarExpanded, setSidebarExpanded } = useStoreDisplaySettings();
  const router = useRouter();

  const logout = () => {
    console.log('logging out');
    document.cookie = 'currentUserHash=undefined';
    router.push('/');
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button
          className="btn btn-square btn-ghost"
          onClick={() => setSidebarExpanded(!isSidebarExpanded)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <a
          onClick={() => router.push('/conversations')}
          className="btn btn-ghost text-xl"
        >
          <ExantaLogo width={125} heigth={125} />
        </a>
      </div>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="items-center btn btn-ghost btn-circle avatar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block items-center h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </div>

        <ul
          tabIndex={0}
          className="menu flex menu-sm dropdown-content p-2 w-[10rem] bg-base-100 rounded-box z-[1] mt-1 w-52 shadow"
        >
          <li className="py-1">
            <a onClick={() => router.push('/conversations')}>
              <Info className="w-5 h-5" />
              User guide
            </a>
          </li>
          <li className="py-1">
            <a onClick={() => logout()}>
              <SignOut className="w-5 h-5" />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

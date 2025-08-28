import React from 'react';

const PasswordHelp = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mt-2">
      <div className="flex items-start gap-2">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">Password Requirements:</h4>
          <ul className="text-xs space-y-1 text-blue-700 dark:text-blue-300">
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              One uppercase letter (A-Z)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              One lowercase letter (a-z)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              One number (0-9)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              One special character (@$!%*?&)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const UsernameHelp = () => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg p-3 mt-2">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-green-700 dark:text-green-300">
            Username can only contain letters, numbers, hyphens (-), and underscores (_)
          </p>
        </div>
      </div>
    </div>
  );
};

export { PasswordHelp, UsernameHelp };
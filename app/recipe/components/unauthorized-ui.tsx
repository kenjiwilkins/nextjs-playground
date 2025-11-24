"use client"

import { SignOutButton } from "./sign-out-button"

interface UnauthorizedUIProps {
  userName?: string | null
  userEmail?: string | null
}

export function UnauthorizedUI({ userName, userEmail }: UnauthorizedUIProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You are not authorized to view this page
            </p>
          </div>

          {/* User Info */}
          {userName && (
            <div className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Signed in as:</p>
              <p className="font-semibold text-gray-900">{userName}</p>
              {userEmail && (
                <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
              )}
            </div>
          )}

          {/* Reason */}
          <div className="w-full bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Reason:</span> This content is only
              accessible to members of our private Discord community.
            </p>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-600">
            Access to this community is by invitation only. If you believe you
            should have access, please contact an administrator.
          </p>

          {/* Actions */}
          <div className="w-full">
            <SignOutButton variant="secondary" />
          </div>
        </div>
      </div>
    </main>
  )
}

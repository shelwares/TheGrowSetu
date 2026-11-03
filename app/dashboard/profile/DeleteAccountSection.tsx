'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/lib/actions/profile'
import { toast } from 'sonner'
import { AlertTriangle, Trash2, Loader2, X } from 'lucide-react'

export default function DeleteAccountSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm.')
      return
    }

    setIsDeleting(true)
    const result = await deleteAccount()
    setIsDeleting(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Your account and personal data have been permanently deleted.')
      setIsOpen(false)
      router.push('/auth/login?message=Account deleted successfully')
      router.refresh()
    }
  }

  return (
    <div className="bg-red-50/50 rounded-2xl border border-red-200 p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-600">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-red-900">Danger Zone — Delete Account</h2>
          <p className="text-xs text-red-700 mt-1 leading-relaxed">
            In compliance with the Digital Personal Data Protection (DPDP) Act, you have the right to request erasure of your personal data. Permanently delete your account, business profile, and saved addresses.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => !isDeleting && setIsOpen(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-5 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base">Permanent Account Deletion</h3>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                This action is <strong className="text-red-600 font-semibold">irreversible</strong>. All your profile information, address details, and account credentials will be permanently erased.
              </p>
              <p className="text-xs text-slate-500">
                To confirm deletion, please type <strong className="text-slate-900 font-mono">DELETE</strong> in the box below:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || confirmText !== 'DELETE'}
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Deletion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

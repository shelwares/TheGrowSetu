'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProductRequestStatus } from '@/lib/actions/admin'
import DemandChart from './DemandChart'
import {
  Copy,
  Check,
  Search,
  Filter,
  BarChart3,
  Table as TableIcon,
  Package,
  TrendingUp,
  Clock,
  Building,
  User,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react'

export interface AdminProductRequest {
  id: string
  buyer_id: string
  product_name: string
  quantity: number
  timeline: string
  additional_details: string | null
  status: 'pending' | 'reviewing' | 'sourced' | 'rejected'
  created_at: string
  profiles?:
    | {
        full_name?: string | null
        company_name?: string | null
        phone?: string | null
      }
    | {
        full_name?: string | null
        company_name?: string | null
        phone?: string | null
      }[]
    | null
}

function getProfile(req: AdminProductRequest) {
  if (Array.isArray(req.profiles)) {
    return req.profiles[0] || null
  }
  return req.profiles || null
}

interface AdminRequestsClientProps {
  initialRequests: AdminProductRequest[]
}

const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  pending: {
    label: 'Pending',
    class: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  reviewing: {
    label: 'Reviewing',
    class: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  sourced: {
    label: 'Sourced (Pool Created)',
    class: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    class: 'bg-rose-100 text-rose-800 border-rose-200',
  },
}

export default function AdminRequestsClient({ initialRequests }: AdminRequestsClientProps) {
  const router = useRouter()
  const [requests, setRequests] = useState<AdminProductRequest[]>(initialRequests)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [copied, setCopied] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Aggregate product demand for the chart
  const demandAnalytics = useMemo(() => {
    const productMap: Record<string, { quantity: number; count: number }> = {}

    requests.forEach((req) => {
      const name = req.product_name.trim()
      if (!productMap[name]) {
        productMap[name] = { quantity: 0, count: 0 }
      }
      productMap[name].quantity += Number(req.quantity) || 0
      productMap[name].count += 1
    })

    return Object.entries(productMap)
      .map(([product, stat]) => ({
        product,
        quantity: stat.quantity,
        count: stat.count,
      }))
      .sort((a, b) => b.quantity - a.quantity)
  }, [requests])

  // Filter requests for the table
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus =
        statusFilter === 'all' || req.status === statusFilter

      const q = searchTerm.toLowerCase().trim()
      const profile = getProfile(req)
      const matchesSearch =
        !q ||
        req.product_name.toLowerCase().includes(q) ||
        (profile?.full_name && profile.full_name.toLowerCase().includes(q)) ||
        (profile?.company_name && profile.company_name.toLowerCase().includes(q)) ||
        (req.timeline && req.timeline.toLowerCase().includes(q)) ||
        (req.additional_details && req.additional_details.toLowerCase().includes(q))

      return matchesStatus && matchesSearch
    })
  }, [requests, searchTerm, statusFilter])

  // Copy table data as TSV (Tab-Separated Values) for Excel/Sheets
  const handleCopyData = async () => {
    if (requests.length === 0) {
      toast.error('No request data available to copy.')
      return
    }

    try {
      const headers = [
        'Date',
        'Buyer Name',
        'Company',
        'Phone',
        'Product Name',
        'Quantity',
        'Timeline',
        'Status',
        'Additional Details',
      ]

      const rows = filteredRequests.map((r) => {
        const profile = getProfile(r)
        return [
          new Date(r.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          profile?.full_name || 'N/A',
          profile?.company_name || 'N/A',
          profile?.phone || 'N/A',
          (r.product_name || '').replace(/[\t\n\r]/g, ' '),
          r.quantity,
          (r.timeline || '').replace(/[\t\n\r]/g, ' '),
          r.status,
          (r.additional_details || '').replace(/[\t\n\r]/g, ' '),
        ]
      })

      const tsvContent = [
        headers.join('\t'),
        ...rows.map((row) => row.join('\t')),
      ].join('\n')

      await navigator.clipboard.writeText(tsvContent)
      setCopied(true)
      toast.success(
        `Copied ${filteredRequests.length} rows to clipboard! Ready to paste directly into Excel or Google Sheets.`
      )
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy table data:', err)
      toast.error('Could not copy data to clipboard.')
    }
  }

  // Handle status update
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      setUpdatingId(requestId)
      const res = await updateProductRequestStatus(requestId, newStatus)
      if (res?.error) {
        toast.error(res.error)
        return
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: newStatus as AdminProductRequest['status'] }
            : r
        )
      )
      toast.success('Request status updated.')
      router.refresh()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Total summary numbers
  const totalUnits = useMemo(
    () => requests.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0),
    [requests]
  )
  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'pending').length,
    [requests]
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 tracking-tight">
            Product Demand &amp; Sourcing Requests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track buyer requests for unlisted products, aggregate demand, and export data for procurement.
          </p>
        </div>

        <button
          onClick={handleCopyData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              Copied for Excel!
            </>
          ) : (
            <>
              <FileSpreadsheet className="w-4 h-4" />
              Copy Data (Excel / Sheets)
            </>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Demand Units
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {totalUnits.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Requests
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {requests.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Unique Products
            </p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">
              {demandAnalytics.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {pendingCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Section: Demand Analytics Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Demand Analytics: Total Quantity Requested per Product
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top requested products ranked by cumulative units demanded by buyers.
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            {demandAnalytics.length} product{demandAnalytics.length === 1 ? '' : 's'} demanded
          </span>
        </div>

        <DemandChart data={demandAnalytics} />
      </div>

      {/* Bottom Section: Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <TableIcon className="w-5 h-5 text-slate-700" />
            <h3 className="font-bold text-slate-900 text-base">All Product Requests</h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredRequests.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search product, buyer, company..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-slate-700 text-xs focus:outline-none pr-2 cursor-pointer font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="sourced">Sourced</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Quick Copy Button */}
            <button
              onClick={handleCopyData}
              title="Copy table to clipboard"
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors inline-flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No requests found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Buyer Name</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => {
                  const badge = STATUS_BADGES[req.status] || STATUS_BADGES.pending
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(req.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Buyer Name */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{getProfile(req)?.full_name || 'Buyer'}</span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{getProfile(req)?.company_name || '—'}</span>
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[220px]">
                        <p className="truncate" title={req.product_name}>
                          {req.product_name}
                        </p>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md text-xs">
                          {req.quantity.toLocaleString()} units
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{req.timeline}</span>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs">
                        <p
                          className="truncate text-xs"
                          title={req.additional_details || 'None'}
                        >
                          {req.additional_details || '—'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          disabled={updatingId === req.id}
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-all ${badge.class} ${
                            updatingId === req.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="sourced">Sourced</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

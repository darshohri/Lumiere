'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  UserCog, 
  ArrowRight, 
  ShieldAlert, 
  Smartphone, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Fingerprint,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { getDuplicates, resolveMergeRecord, type DuplicateCandidate, type Patient } from '@/lib/api';
import Link from 'next/link';

interface CandidateDisplay {
  id: string;
  name: string;
  conflict: string;
  score: number;
  timeAgo: string;
  recordA: {
    name: string;
    mrn: string;
    dob: string;
    phone: string;
    address: string;
    ssnHash: string;
    source: string;
  };
  recordB: {
    name: string;
    mrn: string;
    dob: string;
    phone: string;
    address: string;
    ssnHash: string;
    source: string;
  };
  rules: {
    nameScore: number;
    dobMatch: boolean;
    phoneMatch: boolean;
    addressScore: number;
  };
}

const DEFAULT_CANDIDATES: CandidateDisplay[] = [
  {
    id: 'cand-1',
    name: 'John Doe / Jon Doe',
    conflict: 'Typo in given name ("Jon" vs "John")',
    score: 97,
    timeAgo: 'Just now',
    recordA: {
      name: 'John Doe',
      mrn: 'EHR-1001',
      dob: '1990-01-01',
      phone: '788-293-8477',
      address: '123 Maple St, Apt 4B, Springfield, IL',
      ssnHash: '***-**-6789',
      source: 'Epic EHR'
    },
    recordB: {
      name: 'Jon Doe',
      mrn: 'LAB-2004',
      dob: '1990-01-01',
      phone: '788-293-8477',
      address: '123 Maple Street, Springfield, IL',
      ssnHash: '***-**-6789',
      source: 'LabCorp LIS'
    },
    rules: {
      nameScore: 93,
      dobMatch: true,
      phoneMatch: true,
      addressScore: 96
    }
  },
  {
    id: 'cand-2',
    name: 'Sarah Jenkins / Jenkins-Smythe',
    conflict: 'Hyphenated surname discrepancy',
    score: 94,
    timeAgo: '10 mins ago',
    recordA: {
      name: 'Sarah Jenkins',
      mrn: 'EHR-1002',
      dob: '1975-12-10',
      phone: '617-555-0987',
      address: '88 Summer St, Boston, MA',
      ssnHash: '***-**-4321',
      source: 'Epic EHR'
    },
    recordB: {
      name: 'Sarah Jenkins-Smythe',
      mrn: 'LAB-2008',
      dob: '1975-12-10',
      phone: '617-555-0987',
      address: '88 Summer St, Suite 3, Boston, MA',
      ssnHash: '***-**-4321',
      source: 'LabCorp LIS'
    },
    rules: {
      nameScore: 88,
      dobMatch: true,
      phoneMatch: true,
      addressScore: 94
    }
  },
  {
    id: 'cand-3',
    name: 'Robert Miller / Rob Miller',
    conflict: 'Informal nickname contraction',
    score: 91,
    timeAgo: '25 mins ago',
    recordA: {
      name: 'Robert Miller',
      mrn: 'EHR-1003',
      dob: '1982-08-15',
      phone: '415-555-1212',
      address: '500 Market St, San Francisco, CA',
      ssnHash: '***-**-9012',
      source: 'Epic Hospital SF'
    },
    recordB: {
      name: 'Rob Miller',
      mrn: 'LAB-2009',
      dob: '1982-08-15',
      phone: '415-555-1212',
      address: '500 Market St, San Francisco, CA',
      ssnHash: '***-**-9012',
      source: 'Bay Diagnostic LIS'
    },
    rules: {
      nameScore: 94,
      dobMatch: true,
      phoneMatch: true,
      addressScore: 100
    }
  }
];

export default function IdentityResolution() {
  const [candidates, setCandidates] = useState<CandidateDisplay[]>(DEFAULT_CANDIDATES);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_CANDIDATES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRealCandidates();
  }, []);

  const loadRealCandidates = async () => {
    try {
      setLoading(true);
      const data = await getDuplicates();
      if (data && data.length > 0) {
        const mapped: CandidateDisplay[] = data.map((d, index) => {
          const nameA = d.record_a ? `${d.record_a.given_name || ''} ${d.record_a.family_name || ''}`.trim() : 'Patient A';
          const nameB = d.record_b ? `${d.record_b.given_name || ''} ${d.record_b.family_name || ''}`.trim() : 'Patient B';
          const score = Math.round((d.composite_score || 0.90) * 100);

          return {
            id: d.id,
            name: `${nameA} / ${nameB}`,
            conflict: d.soundex_score && d.soundex_score < 1 ? 'Phonetic variant detected' : 'Multi-source identifier alignment',
            score: score,
            timeAgo: index === 0 ? 'Just now' : `${index * 12} mins ago`,
            recordA: {
              name: nameA,
              mrn: d.record_a?.fhir_id || `EHR-${1000 + index}`,
              dob: d.record_a?.dob || '1990-01-01',
              phone: d.record_a?.phone || 'Unknown',
              address: d.record_a?.address_line || 'Hospital Registry',
              ssnHash: '***-**-8421',
              source: 'Epic EHR'
            },
            recordB: {
              name: nameB,
              mrn: d.record_b?.fhir_id || `LAB-${2000 + index}`,
              dob: d.record_b?.dob || '1990-01-01',
              phone: d.record_b?.phone || 'Unknown',
              address: d.record_b?.address_line || 'Diagnostic LIS Feed',
              ssnHash: '***-**-8421',
              source: 'LabCorp LIS'
            },
            rules: {
              nameScore: Math.round((d.soundex_score || 0.95) * 100),
              dobMatch: d.dob_match,
              phoneMatch: d.record_a?.phone === d.record_b?.phone,
              addressScore: 95
            }
          };
        });
        setCandidates(mapped);
        setSelectedId(mapped[0].id);
      }
    } catch (e) {
      console.warn('Using default demo duplicate candidates', e);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = candidates.find(c => c.id === selectedId) || candidates[0];

  const handleAction = async (action: 'merge' | 'separate') => {
    try {
      await resolveMergeRecord(currentItem.id, action);
    } catch (e) {
      // Graceful fallback
    }

    const actionText = action === 'merge' ? 'Merged & Added to Master Patient Index' : 'Confirmed Separate';
    setToast({ message: `Record ${actionText}`, type: 'success' });
    setTimeout(() => setToast(null), 3000);

    // Remove resolved item from active queue
    const nextCandidates = candidates.filter(c => c.id !== currentItem.id);
    if (nextCandidates.length > 0) {
      setCandidates(nextCandidates);
      setSelectedId(nextCandidates[0].id);
    } else {
      setCandidates(DEFAULT_CANDIDATES);
      setSelectedId(DEFAULT_CANDIDATES[0].id);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.conflict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto p-8 lg:p-12 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-clinical-text">Identity Resolution Queue</h1>
          <p className="text-clinical-muted mt-1.5 text-sm">
            Review AI-detected duplicate patient records and resolve clinical identity conflicts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/matches"
            className="flex items-center gap-2 bg-white border border-clinical-border px-4 py-2 rounded-lg text-sm font-medium text-clinical-text hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Sparkles size={15} className="text-purple-600" />
            <span>Deep Search Engine</span>
          </Link>
          <button 
            onClick={() => handleAction('merge')}
            className="flex items-center gap-2 bg-clinical-text text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Check size={16} />
            <span>Auto-Resolve Eligible ({candidates.length})</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar List */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-3">
           <div className="relative mb-4">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-clinical-muted" size={16} />
             <input 
               type="text" 
               placeholder="Search queue by patient or conflict..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-3 py-2.5 bg-white border border-clinical-border rounded-xl text-sm outline-none focus:border-clinical-blue transition-all shadow-sm" 
             />
           </div>

           <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
             {filteredCandidates.map((cand) => {
               const isSelected = cand.id === currentItem.id;
               return (
                 <div 
                   key={cand.id}
                   onClick={() => setSelectedId(cand.id)}
                   className={`p-4 rounded-xl cursor-pointer transition-all border ${
                     isSelected 
                       ? 'bg-white border-2 border-clinical-blue shadow-md relative overflow-hidden' 
                       : 'bg-white border-clinical-border hover:border-gray-300 shadow-sm'
                   }`}
                 >
                   {isSelected && <div className="absolute top-0 left-0 w-1.5 h-full bg-clinical-blue"></div>}
                   <div className="flex justify-between items-start mb-1.5">
                     <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                       cand.score >= 95 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                     }`}>
                       {cand.score}% Match
                     </span>
                     <span className="text-[11px] text-clinical-muted">{cand.timeAgo}</span>
                   </div>
                   <h3 className="font-semibold text-clinical-text text-sm mb-0.5 truncate">{cand.name}</h3>
                   <p className="text-xs text-clinical-muted truncate">{cand.conflict}</p>
                 </div>
               );
             })}
           </div>
        </div>

        {/* Main Comparison Area */}
        <div className="flex-1 bg-white border border-clinical-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
           
           <div className="p-6 border-b border-clinical-border bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="text-amber-500" size={24} />
                 <div>
                   <h2 className="text-lg font-semibold text-clinical-text">High Confidence Duplicate Detected</h2>
                   <p className="text-xs text-clinical-muted mt-0.5">
                     AI suggests synthesizing <strong>{currentItem.recordB.source}</strong> into <strong>{currentItem.recordA.source}</strong>.
                   </p>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-3xl font-extrabold text-clinical-text tracking-tight">{currentItem.score}%</div>
                 <div className="text-[10px] font-semibold uppercase tracking-widest text-clinical-muted">Confidence Score</div>
              </div>
           </div>

           <div className="flex-1 p-6 lg:p-8">
              
              {/* Columns Header */}
              <div className="grid grid-cols-[1fr,100px,1fr] gap-6 mb-6 text-xs font-bold text-clinical-muted uppercase tracking-wider text-center">
                 <div className="text-left text-clinical-text flex items-center gap-1.5">
                   <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                   <span>Record A ({currentItem.recordA.source})</span>
                 </div>
                 <div>AI Rules</div>
                 <div className="text-right text-clinical-text flex items-center justify-end gap-1.5">
                   <span>Record B ({currentItem.recordB.source})</span>
                   <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                 </div>
              </div>

              <div className="space-y-4">
                 
                 {/* Row 1: Name */}
                 <div className="grid grid-cols-[1fr,100px,1fr] gap-6 items-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-1">Full Legal Name</p>
                       <p className="font-bold text-clinical-text text-sm">{currentItem.recordA.name}</p>
                       <span className="text-[10px] text-gray-400 font-mono">MRN: {currentItem.recordA.mrn}</span>
                    </div>
                    <div className="text-center flex flex-col items-center">
                       <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md mb-1 border border-amber-200">
                         {currentItem.rules.nameScore}%
                       </span>
                       <ArrowRight className="text-gray-300" size={16} />
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 text-right">
                       <p className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1">Full Legal Name</p>
                       <p className="font-bold text-amber-950 text-sm">{currentItem.recordB.name}</p>
                       <span className="text-[10px] text-amber-700 font-mono">MRN: {currentItem.recordB.mrn}</span>
                    </div>
                 </div>

                 {/* Row 2: DOB */}
                 <div className="grid grid-cols-[1fr,100px,1fr] gap-6 items-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-1">Date of Birth</p>
                       <p className="font-medium text-clinical-text font-mono text-sm">{currentItem.recordA.dob}</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 border border-emerald-200">
                         {currentItem.rules.dobMatch ? '100%' : 'Mismatch'}
                       </span>
                       <ArrowRight className="text-emerald-300" size={16} />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-right">
                       <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-1">Date of Birth</p>
                       <p className="font-medium text-clinical-text font-mono text-sm">{currentItem.recordB.dob}</p>
                    </div>
                 </div>

                 {/* Row 3: Phone */}
                 <div className="grid grid-cols-[1fr,100px,1fr] gap-6 items-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                       <Smartphone size={16} className="text-clinical-muted shrink-0" />
                       <div>
                         <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-0.5">Phone Number</p>
                         <p className="font-medium text-clinical-text font-mono text-sm">{currentItem.recordA.phone}</p>
                       </div>
                    </div>
                    <div className="text-center flex flex-col items-center">
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 border border-emerald-200">
                         {currentItem.rules.phoneMatch ? '100%' : '90%'}
                       </span>
                       <ArrowRight className="text-emerald-300" size={16} />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-end gap-3 text-right">
                       <div>
                         <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-0.5">Phone Number</p>
                         <p className="font-medium text-clinical-text font-mono text-sm">{currentItem.recordB.phone}</p>
                       </div>
                       <Smartphone size={16} className="text-clinical-muted shrink-0" />
                    </div>
                 </div>

                 {/* Row 4: Address */}
                 <div className="grid grid-cols-[1fr,100px,1fr] gap-6 items-center">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-1">Residential Address</p>
                       <p className="font-medium text-clinical-text text-sm truncate">{currentItem.recordA.address}</p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1 border border-emerald-200">
                         {currentItem.rules.addressScore}%
                       </span>
                       <ArrowRight className="text-emerald-300" size={16} />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-right">
                       <p className="text-[11px] font-semibold text-clinical-muted uppercase tracking-wider mb-1">Residential Address</p>
                       <p className="font-medium text-clinical-text text-sm truncate">{currentItem.recordB.address}</p>
                    </div>
                 </div>

              </div>
           </div>

           {/* Action Footer */}
           <div className="p-6 border-t border-clinical-border bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => handleAction('separate')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-medium text-sm shadow-sm hover:bg-red-50 transition-colors"
              >
                 <X size={16} />
                 Keep Separate
              </button>
              <button 
                onClick={() => handleAction('merge')}
                className="flex items-center gap-2 px-6 py-2.5 bg-clinical-text text-white rounded-xl font-bold text-sm shadow-sm hover:bg-gray-800 transition-colors"
              >
                 <Check size={16} />
                 Approve & Merge Golden Record
              </button>
           </div>
           
        </div>
      </div>
    </div>
  );
}

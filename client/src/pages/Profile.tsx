import { useContext, useEffect, useId, useState, type ReactNode } from 'react';
import {
  Mail, Phone, MapPin, Pencil, Check, X, Briefcase, GraduationCap,
  Loader2, CheckCircle2, AlertCircle, Lock,
} from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { updateProfile } from '@/api/auth';
import { Navigate } from 'react-router-dom';
 
const roleLabels = {
  student: 'Student',
  owner: 'Property owner',
  food_service: 'Food service',
} as const;
 
const getInitialFormData = (u: any) => ({
  fullname: u?.fullname || '',
  email: u?.email || '',
  phoneNumber: u?.phoneNumber || '',
  role: u?.role || 'student',
  profileImage: u?.profileImage || '',
  bio: u?.bio || '',
  university: u?.university || '',
  location: { city: u?.location?.city || '', state: u?.location?.state || '' },
});
 
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 ' +
  'focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 disabled:cursor-not-allowed ' +
  'disabled:bg-slate-100 disabled:text-slate-500';
 
function Field({ label, hint, className = '', children }: {
  label: string; hint?: string; className?: string;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children(id)}
      {hint && <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
 
function Row({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="flex items-start gap-3.5 py-3.5">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
      <div className="min-w-0">
        <dt className="text-sm text-slate-500">{label}</dt>
        <dd className={`wrap-break-words font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value || 'Not added'}
        </dd>
      </div>
    </div>
  );
}
 
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
 
export default function Profile() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthContext not found');
 
  const { user, setUser, loading } = auth;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState(getInitialFormData(user));
 
  useEffect(() => {
    if (user && !isEditing) setFormData(getInitialFormData(user));
  }, [user, isEditing]);
 
  const handleSave = async () => {
    setMessage(null);
    setIsSaving(true);
    try {
      const res = await updateProfile(formData);
      setUser(res.data.data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile saved' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || "Couldn't save your changes. Check your connection and try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
 
  const handleCancel = () => {
    setFormData(getInitialFormData(user));
    setIsEditing(false);
    setMessage(null);
  };
 
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" aria-label="Loading profile" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
 
  const isStudent = (isEditing ? formData.role : user.role) === 'student';
  const orgLabel = isStudent ? 'University or college' : 'Business name';
 
  // Profile completeness
  const checks = [user.fullname, user.phoneNumber, user.university, user.location?.city, user.location?.state, user.bio];
  const done = checks.filter(Boolean).length;
  const percent = Math.round((done / checks.length) * 100);
  const location = [user.location?.city, user.location?.state].filter(Boolean).join(', ');
 
  const set = (patch: Partial<typeof formData>) => setFormData({ ...formData, ...patch });
 
  return (
    <div className="min-h-screen bg-slate-50 pb-16 pt-24">
      {/* Toast */}
      <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4" role="status" aria-live="polite">
        {message && (
          <div
            className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}
      </div>
 
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Identity column */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center">
              {user.profileImage ? (
                <img src={user.profileImage} alt="" className="h-24 w-24 rounded-full object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600 text-4xl font-semibold text-white">
                  {user.fullname?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <h1 className="mt-4 text-xl font-semibold text-slate-900">{user.fullname}</h1>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                {user.role === 'student' ? <GraduationCap className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                {roleLabels[user.role as keyof typeof roleLabels]}
              </span>
              {location && (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" /> {location}
                </p>
              )}
            </div>
 
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span className="font-medium text-slate-700">Profile complete</span>
                <span className="font-semibold text-slate-900">{percent}%</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}
              >
                <div className="h-full rounded-full bg-violet-600 transition-all duration-500" style={{ width: `${percent}%` }} />
              </div>
              {percent < 100 && (
                <p className="mt-2 text-xs text-slate-500">
                  Add the missing details so others can trust and reach you.
                </p>
              )}
            </div>
 
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
              >
                <Pencil className="h-4 w-4" /> Edit profile
              </button>
            )}
          </aside>
 
          {/* Details column */}
          <div className="space-y-6">
            {isEditing ? (
              <>
                <Section title="Personal details">
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name">
                      {(id) => (
                        <input id={id} type="text" className={inputClass} value={formData.fullname}
                          onChange={(e) => set({ fullname: e.target.value })} />
                      )}
                    </Field>
                    <Field label="Phone number">
                      {(id) => (
                        <input id={id} type="tel" inputMode="tel" className={inputClass} value={formData.phoneNumber}
                          onChange={(e) => set({ phoneNumber: e.target.value })} />
                      )}
                    </Field>
                    <Field
                      label="Email"
                      className="sm:col-span-2"
                      hint={<><Lock className="h-3 w-3" /> Email can't be changed here.</> as any}
                    >
                      {(id) => <input id={id} type="email" disabled className={inputClass} value={formData.email} />}
                    </Field>
                  </div>
                </Section>
 
                <Section title={isStudent ? 'Education' : 'Business'}>
                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <Field label="I am a" className="sm:col-span-2">
                      {(id) => (
                        <select id={id} className={inputClass} value={formData.role}
                          onChange={(e) => set({ role: e.target.value as any })}>
                          <option value="student">Student</option>
                          <option value="food_service">Food service (tiffin provider)</option>
                          <option value="owner">Property owner</option>
                        </select>
                      )}
                    </Field>
                    <Field label={orgLabel} className="sm:col-span-2">
                      {(id) => (
                        <input id={id} type="text" className={inputClass} value={formData.university}
                          onChange={(e) => set({ university: e.target.value })} />
                      )}
                    </Field>
                    <Field label="City">
                      {(id) => (
                        <input id={id} type="text" className={inputClass} value={formData.location.city}
                          onChange={(e) => set({ location: { ...formData.location, city: e.target.value } })} />
                      )}
                    </Field>
                    <Field label="State">
                      {(id) => (
                        <input id={id} type="text" className={inputClass} value={formData.location.state}
                          onChange={(e) => set({ location: { ...formData.location, state: e.target.value } })} />
                      )}
                    </Field>
                  </div>
                </Section>
 
                <Section title="About you">
                  <div className="mt-4">
                    <Field label="Bio">
                      {(id) => (
                        <>
                          <textarea id={id} rows={4} maxLength={300} className={`${inputClass} resize-none`}
                            placeholder="Share where you're from, what you study or offer, and what you're looking for."
                            value={formData.bio} onChange={(e) => set({ bio: e.target.value })} />
                          <p className="mt-1 text-right text-xs text-slate-500">{formData.bio.length}/300</p>
                        </>
                      )}
                    </Field>
                  </div>
                </Section>
 
                <div className="sticky bottom-4 flex justify-end gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur">
                  <button
                    onClick={handleCancel} disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSave} disabled={isSaving}
                    className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isSaving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Section title="Contact">
                  <dl className="divide-y divide-slate-100">
                    <Row icon={Mail} label="Email" value={user.email} />
                    <Row icon={Phone} label="Phone" value={user.phoneNumber} />
                    <Row icon={MapPin} label="Location" value={location} />
                  </dl>
                </Section>
 
                <Section title={isStudent ? 'Education' : 'Business'}>
                  <dl>
                    <Row
                      icon={isStudent ? GraduationCap : Briefcase}
                      label={orgLabel}
                      value={user.university}
                    />
                  </dl>
                </Section>
 
                <Section title="About">
                  {user.bio ? (
                    <p className="mt-2 max-w-prose whitespace-pre-line leading-relaxed text-slate-700">{user.bio}</p>
                  ) : (
                    <div className="mt-2">
                      <p className="text-slate-500">You haven't written a bio yet.</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-2 font-medium text-violet-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
                      >
                        Add a bio
                      </button>
                    </div>
                  )}
                </Section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
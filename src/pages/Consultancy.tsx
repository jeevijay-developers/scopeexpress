import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, GraduationCap, HelpCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Category = 'job' | 'admission' | 'other' | null;

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}

const Field = ({ name, label, type = 'text', required = false, textarea = false, placeholder = '', value, onChange }: FieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={name}>
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {textarea ? (
      <Textarea id={name} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    ) : (
      <Input id={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} />
    )}
  </div>
);

const Consultancy = () => {
  const [category, setCategory] = useState<Category>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const reset = () => {
    setCategory(null);
    setForm({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!form.full_name || !form.mobile) {
      toast.error('Name and mobile are required');
      return;
    }
    setSubmitting(true);
    const { full_name, mobile, email, ...rest } = form;
    const { error } = await supabase.from('consultancy_submissions').insert({
      id: crypto.randomUUID(),
      category,
      full_name,
      mobile,
      email: email || null,
      data: rest,
    });
    setSubmitting(false);
    if (error) {
      toast.error('Submission failed. Please try again.');
      return;
    }
    toast.success('Thank you! Our team will reach out shortly.');
    reset();
  };

  const f = (name: string, label: string, opts: Partial<FieldProps> = {}) => (
    <Field name={name} label={label} value={form[name] || ''} onChange={(v) => set(name, v)} {...opts} />
  );

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Consultancy Services</h1>
            <p className="text-muted-foreground">Choose a category to get started</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { key: 'job', icon: Briefcase, title: 'Job', desc: 'Career & job placement guidance', color: 'text-blue-600 bg-blue-50' },
              { key: 'admission', icon: GraduationCap, title: 'Admission', desc: 'School / College admission help', color: 'text-orange-600 bg-orange-50' },
              { key: 'other', icon: HelpCircle, title: 'Other', desc: 'Any other consultancy enquiry', color: 'text-red-600 bg-red-50' },
            ].map((c) => (
              <Card
                key={c.key}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => setCategory(c.key as Category)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${c.color}`}>
                    <c.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground">{c.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Button variant="ghost" onClick={reset} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to categories
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl capitalize">{category} Consultancy Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {f('full_name', 'Candidate Full Name', { required: true })}

              <div className="space-y-1.5">
                <Label>Gender</Label>
                <RadioGroup className="flex flex-wrap gap-4" value={form.gender || ''} onValueChange={(v) => set('gender', v)}>
                  {['Male', 'Female', 'Married', 'Unmarried'].map((g) => (
                    <div key={g} className="flex items-center gap-2">
                      <RadioGroupItem value={g} id={`g-${g}`} />
                      <Label htmlFor={`g-${g}`} className="font-normal">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {f('mobile', 'Mobile Number', { type: 'tel', required: true })}
              {f('home_address', 'Home Land Line / Mobile Number')}
              {f('permanent_address', 'Permanent Address', { textarea: true })}
              {f('current_address', 'Current Address', { textarea: true })}
              {f('email', 'Email ID (In Capital Letter)', { type: 'email' })}
              {f('dob', 'Date of Birth', { type: 'date' })}
              {f('languages', 'Language Knowledge', { placeholder: 'e.g. Hindi, English' })}
              {f('education', 'Education Detail', { textarea: true })}

              {category === 'job' && (
                <>
                  <div className="space-y-1.5">
                    <Label>Job Experience</Label>
                    <RadioGroup className="flex flex-wrap gap-4" value={form.experience || ''} onValueChange={(v) => set('experience', v)}>
                      {['Current Job', 'Previous Job', 'Fresher'].map((g) => (
                        <div key={g} className="flex items-center gap-2">
                          <RadioGroupItem value={g} id={`e-${g}`} />
                          <Label htmlFor={`e-${g}`} className="font-normal">{g}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  {f('employer', 'Employer / Company Name')}
                  {f('designation', 'Designation')}
                  {f('current_salary', 'Salary (Monthly)')}
                  {f('expected_salary', 'Expected Salary (Monthly)')}
                  {f('notice_period', 'Notice Period (Days)')}
                  {f('looking_for', 'I am Looking For Job Like', { textarea: true })}
                </>
              )}

              {category === 'admission' && (
                <>
                  {f('course_interest', 'Course / Class Interested In', { required: true })}
                  {f('preferred_institute', 'Preferred Institute / College')}
                  {f('last_qualification', 'Last Qualification & Percentage')}
                  {f('passing_year', 'Year of Passing')}
                  {f('board_university', 'Board / University')}
                  {f('preferred_location', 'Preferred Location')}
                  {f('budget', 'Budget (Annual Fees)')}
                  {f('notes', 'Additional Notes', { textarea: true })}
                </>
              )}

              {category === 'other' && (
                <>
                  {f('enquiry_topic', 'Enquiry Topic', { required: true })}
                  {f('preferred_contact_time', 'Preferred Contact Time')}
                  {f('message', 'Tell us how we can help', { textarea: true, required: true })}
                </>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Consultancy;
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

  const Field = ({ name, label, type = 'text', required = false, textarea = false, placeholder = '' }: any) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {textarea ? (
        <Textarea id={name} value={form[name] || ''} onChange={(e) => set(name, e.target.value)} placeholder={placeholder} required={required} />
      ) : (
        <Input id={name} type={type} value={form[name] || ''} onChange={(e) => set(name, e.target.value)} placeholder={placeholder} required={required} />
      )}
    </div>
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
              <Field name="full_name" label="Candidate Full Name" required />

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

              <Field name="mobile" label="Mobile Number" type="tel" required />
              <Field name="home_address" label="Home Land Line / Mobile Number" />
              <Field name="permanent_address" label="Permanent Address" textarea />
              <Field name="current_address" label="Current Address" textarea />
              <Field name="email" label="Email ID (In Capital Letter)" type="email" />
              <Field name="dob" label="Date of Birth" type="date" />
              <Field name="languages" label="Language Knowledge" placeholder="e.g. Hindi, English" />
              <Field name="education" label="Education Detail" textarea />

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
                  <Field name="employer" label="Employer / Company Name" />
                  <Field name="designation" label="Designation" />
                  <Field name="current_salary" label="Salary (Monthly)" />
                  <Field name="expected_salary" label="Expected Salary (Monthly)" />
                  <Field name="notice_period" label="Notice Period (Days)" />
                  <Field name="looking_for" label="I am Looking For Job Like" textarea />
                </>
              )}

              {category === 'admission' && (
                <>
                  <Field name="course_interest" label="Course / Class Interested In" required />
                  <Field name="preferred_institute" label="Preferred Institute / College" />
                  <Field name="last_qualification" label="Last Qualification & Percentage" />
                  <Field name="passing_year" label="Year of Passing" />
                  <Field name="board_university" label="Board / University" />
                  <Field name="preferred_location" label="Preferred Location" />
                  <Field name="budget" label="Budget (Annual Fees)" />
                  <Field name="notes" label="Additional Notes" textarea />
                </>
              )}

              {category === 'other' && (
                <>
                  <Field name="enquiry_topic" label="Enquiry Topic" required />
                  <Field name="preferred_contact_time" label="Preferred Contact Time" />
                  <Field name="message" label="Tell us how we can help" textarea required />
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
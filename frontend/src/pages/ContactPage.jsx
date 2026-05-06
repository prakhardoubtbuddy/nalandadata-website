import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  Mail,
  MapPin,
  Phone,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import API from "@/lib/api";

const countryCodes = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
];

const companyTypes = [
  { value: "ai_lab", label: "AI Lab" },
  { value: "startup", label: "Startup" },
  { value: "research_institute", label: "Research Institute" },
  { value: "edtech", label: "EdTech" },
  { value: "enterprise", label: "Enterprise" },
  { value: "other", label: "Other" },
];

const useCases = [
  { value: "pretraining", label: "Pretraining" },
  { value: "finetuning", label: "Fine-tuning" },
  { value: "rlhf", label: "RLHF / DPO" },
  { value: "evaluation", label: "Evaluation" },
  { value: "research", label: "Research" },
  { value: "other", label: "Other" },
];

const datasetOptions = [
  { value: "stem-reasoning", label: "STEM Reasoning & Problem Solving" },
  { value: "language-literacy", label: "Language, Literacy & Comprehension" },
  { value: "social-sciences", label: "Social Sciences, Civics & General Knowledge" },
  { value: "higher-education", label: "Higher Education & Professional Knowledge" },
  { value: "custom", label: "Custom Dataset" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: "",
    work_email: "",
    company: "",
    role: "",
    company_type: "",
    use_case: "",
    dataset_interest: "",
    message: "",
    mobile_country_code: "+91-India",
    mobile_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.work_email) newErrors.work_email = "Work email is required";
    if (!formData.company) newErrors.company = "Company is required";
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.company_type) newErrors.company_type = "Please select a company type";
    if (!formData.use_case) newErrors.use_case = "Please select a use case";
    if (!formData.dataset_interest) newErrors.dataset_interest = "Please select a dataset";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      setIsSubmitted(true);
      toast.success("Thank you! We'll be in touch soon.");
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Error submitting:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24" data-testid="contact-page">
      <Helmet>
        <title>Request Dataset Access — Nalandadata.ai</title>
        <meta name="description" content="Request access to Nalandadata AI training datasets. Contact our team to discuss licensing, custom datasets, and enterprise agreements." />
      </Helmet>
      {/* Header */}
      <section className="py-16 relative">
        <div className="absolute inset-0 hero-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Request Dataset Access
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tell us about your project and we'll help you find the right datasets for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-400 leading-relaxed">
                  Our data experts are ready to help you find the perfect datasets for your AI projects. 
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-gray-400">info@nalandadata.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Headquarters</h3>
                    <p className="text-gray-400">A27, 2nd Floor, Mohan Cooperative Industrial Estate, New Delhi - 110 044, INDIA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Phone</h3>
                    <p className="text-gray-400">+91 11 4973 1800</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
                <h3 className="text-white font-medium mb-3">Enterprise Sales</h3>
                <p className="text-gray-400 text-sm mb-4">
                  For large-scale data licensing and custom partnerships, contact our enterprise team.
                </p>
                <a href="mailto:info@nalandadata.ai" className="text-blue-400 text-sm hover:underline">
                  info@nalandadata.ai
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="p-8 rounded-2xl bg-[#121212] border border-white/5">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Request Submitted!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for your interest. Our data experts will reach out within 24 hours 
                      to discuss your requirements.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          full_name: "",
                          work_email: "",
                          company: "",
                          role: "",
                          company_type: "",
                          use_case: "",
                          dataset_interest: "",
                          message: "",
                          mobile_country_code: "+91-India",
                          mobile_number: "",
                        });
                      }}
                      variant="outline"
                      className="btn-secondary"
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => { setFormData({ ...formData, full_name: e.target.value }); setErrors(p => ({ ...p, full_name: "" })); }}
                          className={`bg-black/50 border-white/10 text-white placeholder:text-gray-600 ${errors.full_name ? "border-red-500/60" : ""}`}
                          placeholder="John Smith"
                          aria-describedby={errors.full_name ? "full_name-error" : undefined}
                          data-testid="contact-form-name"
                        />
                        {errors.full_name && <p id="full_name-error" className="text-red-400 text-xs mt-1">{errors.full_name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="work_email" className="text-gray-300">Work Email *</Label>
                        <Input
                          id="work_email"
                          type="email"
                          value={formData.work_email}
                          onChange={(e) => { setFormData({ ...formData, work_email: e.target.value }); setErrors(p => ({ ...p, work_email: "" })); }}
                          className={`bg-black/50 border-white/10 text-white placeholder:text-gray-600 ${errors.work_email ? "border-red-500/60" : ""}`}
                          placeholder="john@company.com"
                          aria-describedby={errors.work_email ? "work_email-error" : undefined}
                          data-testid="contact-form-email"
                        />
                        {errors.work_email && <p id="work_email-error" className="text-red-400 text-xs mt-1">{errors.work_email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Mobile Number</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.mobile_country_code}
                          onValueChange={(value) => setFormData({ ...formData, mobile_country_code: value })}
                        >
                          <SelectTrigger className="bg-black/50 border-white/10 text-white w-36 flex-shrink-0" data-testid="contact-form-country-code">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-white/10 max-h-60">
                            {countryCodes.map((c, i) => (
                              <SelectItem key={`${c.code}-${c.country}-${i}`} value={`${c.code}-${c.country}`} className="text-white hover:bg-white/10">
                                {c.flag} {c.country} ({c.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="tel"
                          value={formData.mobile_number}
                          onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                          className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 flex-1"
                          placeholder="Mobile number"
                          data-testid="contact-form-mobile"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-300">Company *</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => { setFormData({ ...formData, company: e.target.value }); setErrors(p => ({ ...p, company: "" })); }}
                          className={`bg-black/50 border-white/10 text-white placeholder:text-gray-600 ${errors.company ? "border-red-500/60" : ""}`}
                          placeholder="Company name"
                          aria-describedby={errors.company ? "company-error" : undefined}
                          data-testid="contact-form-company"
                        />
                        {errors.company && <p id="company-error" className="text-red-400 text-xs mt-1">{errors.company}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-300">Role *</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => { setFormData({ ...formData, role: e.target.value }); setErrors(p => ({ ...p, role: "" })); }}
                          className={`bg-black/50 border-white/10 text-white placeholder:text-gray-600 ${errors.role ? "border-red-500/60" : ""}`}
                          placeholder="ML Engineer"
                          aria-describedby={errors.role ? "role-error" : undefined}
                          data-testid="contact-form-role"
                        />
                        {errors.role && <p id="role-error" className="text-red-400 text-xs mt-1">{errors.role}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Company Type *</Label>
                        <Select
                          value={formData.company_type}
                          onValueChange={(value) => { setFormData({ ...formData, company_type: value }); setErrors(p => ({ ...p, company_type: "" })); }}
                        >
                          <SelectTrigger className={`bg-black/50 border-white/10 text-white ${errors.company_type ? "border-red-500/60" : ""}`} data-testid="contact-form-company-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-white/10">
                            {companyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="text-white hover:bg-white/10">
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.company_type && <p className="text-red-400 text-xs mt-1">{errors.company_type}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Use Case *</Label>
                        <Select
                          value={formData.use_case}
                          onValueChange={(value) => { setFormData({ ...formData, use_case: value }); setErrors(p => ({ ...p, use_case: "" })); }}
                        >
                          <SelectTrigger className={`bg-black/50 border-white/10 text-white ${errors.use_case ? "border-red-500/60" : ""}`} data-testid="contact-form-use-case">
                            <SelectValue placeholder="Select use case" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-white/10">
                            {useCases.map((uc) => (
                              <SelectItem key={uc.value} value={uc.value} className="text-white hover:bg-white/10">
                                {uc.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.use_case && <p className="text-red-400 text-xs mt-1">{errors.use_case}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Dataset Interest *</Label>
                      <Select
                        value={formData.dataset_interest}
                        onValueChange={(value) => { setFormData({ ...formData, dataset_interest: value }); setErrors(p => ({ ...p, dataset_interest: "" })); }}
                      >
                        <SelectTrigger className={`bg-black/50 border-white/10 text-white ${errors.dataset_interest ? "border-red-500/60" : ""}`} data-testid="contact-form-dataset">
                          <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10">
                          {datasetOptions.map((ds) => (
                            <SelectItem key={ds.value} value={ds.value} className="text-white hover:bg-white/10">
                              {ds.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.dataset_interest && <p className="text-red-400 text-xs mt-1">{errors.dataset_interest}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-300">Tell us about your project</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 min-h-[120px]"
                        placeholder="Describe your use case, data requirements, and any specific needs..."
                        data-testid="contact-form-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-6"
                      data-testid="contact-form-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By submitting, you agree to our privacy policy and terms of service.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

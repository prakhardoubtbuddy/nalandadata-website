import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Download, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

export function LeadCaptureForm({ open, onOpenChange, preselectedDataset, downloadFiles, inline = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstNameRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    work_email: "",
    company: "",
    role: "",
    company_type: "",
    use_case: "",
    dataset_interest: preselectedDataset || "",
    message: "",
    mobile_country_code: "+91-India",
    mobile_number: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.work_email || !formData.company || 
        !formData.role || !formData.company_type || !formData.use_case || 
        !formData.dataset_interest || !formData.mobile_number) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      setIsSubmitted(true);
      toast.success("Thank you! Your request has been submitted.");
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("Error submitting lead:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(`${API}/files/${file.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Downloading ${file.original_filename}`);
    } catch (error) {
      toast.error("Download failed. Please try again.");
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      full_name: "",
      work_email: "",
      company: "",
      role: "",
      company_type: "",
      use_case: "",
      dataset_interest: preselectedDataset || "",
      message: "",
      mobile_country_code: "+91-India",
      mobile_number: "",
    });
  };

  const formContent = isSubmitted ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-6"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <p className="text-center text-[#999] mb-6">
        Thank you for your interest! Our data experts will be in touch shortly.
      </p>

      {downloadFiles && downloadFiles.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-[#888] text-center mb-4">Download sample datasets:</p>
          {downloadFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => handleDownload(file)}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded hover:bg-white/10 transition-colors"
              data-testid={`download-file-${file.id}`}
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#C8A96E]" />
                <div className="text-left">
                  <p className="text-[#F0EBE0] text-sm font-medium">{file.original_filename}</p>
                  <p className="text-[#555] text-xs">{(file.file_size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <span className="text-xs text-[#555] uppercase">{file.file_type}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#555] text-sm">
          No sample files available yet. We'll contact you with download access.
        </p>
      )}
    </motion.div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-[#999] text-xs uppercase tracking-wider">Full Name *</Label>
          <Input
            ref={firstNameRef}
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] rounded h-9 text-sm"
            placeholder="Jane Smith"
            data-testid="lead-form-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="work_email" className="text-[#999] text-xs uppercase tracking-wider">Work Email *</Label>
          <Input
            id="work_email"
            type="email"
            value={formData.work_email}
            onChange={(e) => setFormData({ ...formData, work_email: e.target.value })}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] rounded h-9 text-sm"
            placeholder="jane@company.com"
            data-testid="lead-form-email"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-[#999] text-xs uppercase tracking-wider">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] rounded h-9 text-sm"
            placeholder="Company name"
            data-testid="lead-form-company"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-[#999] text-xs uppercase tracking-wider">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] rounded h-9 text-sm"
            placeholder="ML Engineer / Data Procurement"
            data-testid="lead-form-role"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[#999] text-xs uppercase tracking-wider">Mobile Number *</Label>
        <div className="flex gap-2">
          <Select
            value={formData.mobile_country_code}
            onValueChange={(value) => setFormData({ ...formData, mobile_country_code: value })}
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] w-32 flex-shrink-0 h-9 text-sm" data-testid="lead-form-country-code">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A] max-h-60">
              {countryCodes.map((c, i) => (
                <SelectItem key={`${c.code}-${c.country}-${i}`} value={`${c.code}-${c.country}`} className="text-[#F0EBE0] hover:bg-white/10 text-sm">
                  {c.flag} {c.country} ({c.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={formData.mobile_number}
            onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
            className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] flex-1 rounded h-9 text-sm"
            placeholder="Mobile number"
            data-testid="lead-form-mobile"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[#999] text-xs uppercase tracking-wider">Company Type *</Label>
          <Select
            value={formData.company_type}
            onValueChange={(value) => setFormData({ ...formData, company_type: value })}
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] h-9 text-sm" data-testid="lead-form-company-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
              {companyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-[#F0EBE0] hover:bg-white/10 text-sm">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[#999] text-xs uppercase tracking-wider">Use Case *</Label>
          <Select
            value={formData.use_case}
            onValueChange={(value) => setFormData({ ...formData, use_case: value })}
          >
            <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] h-9 text-sm" data-testid="lead-form-use-case">
              <SelectValue placeholder="Select your primary use case" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
              {useCases.map((uc) => (
                <SelectItem key={uc.value} value={uc.value} className="text-[#F0EBE0] hover:bg-white/10 text-sm">
                  {uc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[#999] text-xs uppercase tracking-wider">Dataset Interest *</Label>
        <Select
          value={formData.dataset_interest}
          onValueChange={(value) => setFormData({ ...formData, dataset_interest: value })}
        >
          <SelectTrigger className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] h-9 text-sm" data-testid="lead-form-dataset">
            <SelectValue placeholder="Which datasets are you most interested in?" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1A1A] border-[#2A2A2A]">
            {datasetOptions.map((ds) => (
              <SelectItem key={ds.value} value={ds.value} className="text-[#F0EBE0] hover:bg-white/10 text-sm">
                {ds.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-[#999] text-xs uppercase tracking-wider">Tell Us About Your Project</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-[#1A1A1A] border-[#2A2A2A] text-[#F0EBE0] placeholder:text-[#444] min-h-[90px] rounded text-sm"
          placeholder="Describe your model training objective, data scale requirements, and any specific language or subject needs..."
          data-testid="lead-form-message"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#C8A96E] hover:bg-[#D4B896] text-[#0D0D0D] font-semibold rounded h-11 text-sm"
        data-testid="lead-form-submit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Dataset Access →"
        )}
      </Button>

      <p className="text-xs text-[#555] text-center">
        No commitment required
      </p>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent
        className="bg-[#141414] border-[#252525] text-[#F0EBE0] max-w-lg max-h-[90vh] overflow-y-auto"
        data-testid="lead-capture-dialog"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          firstNameRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#F0EBE0]">
            {isSubmitted ? "Download Sample Dataset" : "Request Dataset Access"}
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}

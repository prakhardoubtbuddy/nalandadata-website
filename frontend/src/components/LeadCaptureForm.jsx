import { useState } from "react";
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

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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
];

const datasetOptions = [
  { value: "academic-reasoning", label: "Academic Reasoning" },
  { value: "stem-datasets", label: "STEM Datasets" },
  { value: "multilingual-education", label: "Multilingual Education" },
  { value: "ocr-document-ai", label: "OCR & Document AI" },
  { value: "speech-audio-learning", label: "Speech & Audio Learning" },
  { value: "custom", label: "Custom Dataset" },
];

export function LeadCaptureForm({ open, onOpenChange, preselectedDataset, downloadFiles }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.work_email || !formData.company || 
        !formData.role || !formData.company_type || !formData.use_case || 
        !formData.dataset_interest) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/leads`, formData);
      setIsSubmitted(true);
      toast.success("Thank you! Your request has been submitted.");
    } catch (error) {
      console.error("Error submitting lead:", error);
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetForm();
      onOpenChange(value);
    }}>
      <DialogContent className="bg-[#121212] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto" data-testid="lead-capture-dialog">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isSubmitted ? "Download Sample Dataset" : "Request Dataset Access"}
          </DialogTitle>
        </DialogHeader>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-center text-gray-300 mb-6">
              Thank you for your interest! Our data experts will reach out to discuss custom dataset requirements.
            </p>
            
            {downloadFiles && downloadFiles.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-400 text-center mb-4">Download sample datasets:</p>
                {downloadFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => handleDownload(file)}
                    className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    data-testid={`download-file-${file.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-blue-400" />
                      <div className="text-left">
                        <p className="text-white text-sm font-medium">{file.original_filename}</p>
                        <p className="text-gray-500 text-xs">{(file.file_size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 uppercase">{file.file_type}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                No sample files available yet. We'll contact you with download access.
              </p>
            )}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  placeholder="John Smith"
                  data-testid="lead-form-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_email" className="text-gray-300">Work Email *</Label>
                <Input
                  id="work_email"
                  type="email"
                  value={formData.work_email}
                  onChange={(e) => setFormData({ ...formData, work_email: e.target.value })}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  placeholder="john@company.com"
                  data-testid="lead-form-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-300">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  placeholder="Company name"
                  data-testid="lead-form-company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-300">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                  placeholder="ML Engineer"
                  data-testid="lead-form-role"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Company Type *</Label>
                <Select
                  value={formData.company_type}
                  onValueChange={(value) => setFormData({ ...formData, company_type: value })}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white" data-testid="lead-form-company-type">
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
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Use Case *</Label>
                <Select
                  value={formData.use_case}
                  onValueChange={(value) => setFormData({ ...formData, use_case: value })}
                >
                  <SelectTrigger className="bg-black/50 border-white/10 text-white" data-testid="lead-form-use-case">
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
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Dataset Interest *</Label>
              <Select
                value={formData.dataset_interest}
                onValueChange={(value) => setFormData({ ...formData, dataset_interest: value })}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white" data-testid="lead-form-dataset">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 min-h-[80px]"
                placeholder="Tell us about your project..."
                data-testid="lead-form-message"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary"
              data-testid="lead-form-submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit & Get Access"
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to our privacy policy and terms of service.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

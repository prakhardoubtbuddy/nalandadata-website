import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Upload,
  FileText,
  Users,
  Download,
  Trash2,
  LogOut,
  Plus,
  X,
  Loader2,
  Database,
  BarChart3
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const datasetCategories = [
  { value: "academic-reasoning", label: "Academic Reasoning" },
  { value: "stem-datasets", label: "STEM Datasets" },
  { value: "multilingual-education", label: "Multilingual Education" },
  { value: "ocr-document-ai", label: "OCR & Document AI" },
  { value: "speech-audio-learning", label: "Speech & Audio Learning" },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ leads_count: 0, files_count: 0, total_downloads: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    dataset_category: "",
    description: "",
    is_sample: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Check auth from localStorage
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [filesRes, leadsRes, statsRes] = await Promise.all([
        axios.get(`${API}/files`),
        axios.get(`${API}/leads`),
        axios.get(`${API}/stats`)
      ]);
      setFiles(filesRes.data);
      setLeads(leadsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Login successful");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    toast.success("Logged out");
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['csv', 'pdf', 'json', 'xlsx'].includes(ext)) {
        toast.error("Only CSV, PDF, JSON, and XLSX files are allowed");
        return;
      }
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file || !uploadData.dataset_category) {
      toast.error("Please select a file and category");
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("dataset_category", uploadData.dataset_category);
    formData.append("description", uploadData.description);
    formData.append("is_sample", uploadData.is_sample);

    try {
      await axios.post(`${API}/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("File uploaded successfully");
      setIsUploadOpen(false);
      setUploadData({ file: null, dataset_category: "", description: "", is_sample: true });
      fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    
    try {
      await axios.delete(`${API}/files/${fileId}`);
      toast.success("File deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    
    try {
      await axios.delete(`${API}/leads/${leadId}`);
      toast.success("Lead deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete lead");
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
    } catch (error) {
      toast.error("Download failed");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4" data-testid="admin-login-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-500">S Chand AI Infrastructure</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 rounded-2xl bg-[#121212] border border-white/5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/50 border-white/10 text-white"
                  placeholder="Enter username"
                  data-testid="admin-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border-white/10 text-white"
                  placeholder="Enter password"
                  data-testid="admin-password"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full btn-primary"
                data-testid="admin-login-btn"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0A0A0A]" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-[#121212] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <span className="text-white font-semibold">Admin Panel</span>
                <span className="text-gray-500 text-sm block -mt-1">S Chand AI</span>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-400 hover:text-white"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.files_count}</p>
                <p className="text-gray-500 text-sm">Total Files</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.leads_count}</p>
                <p className="text-gray-500 text-sm">Total Leads</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-[#121212] border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.total_downloads}</p>
                <p className="text-gray-500 text-sm">Total Downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("files")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "files"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
            data-testid="admin-tab-files"
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Files
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "leads"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white"
            }`}
            data-testid="admin-tab-leads"
          >
            <Users className="w-4 h-4 inline mr-2" />
            Leads
          </button>
        </div>

        {/* Content */}
        {activeTab === "files" && (
          <div className="rounded-xl bg-[#121212] border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dataset Files</h2>
              <Button
                onClick={() => setIsUploadOpen(true)}
                className="btn-primary"
                data-testid="admin-upload-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto" />
              </div>
            ) : files.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No files uploaded yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400">Filename</TableHead>
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Size</TableHead>
                    <TableHead className="text-gray-400">Downloads</TableHead>
                    <TableHead className="text-gray-400">Uploaded</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="border-white/5">
                      <TableCell className="text-white font-medium">
                        {file.original_filename}
                        {file.is_sample && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            Sample
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400">{file.dataset_category}</TableCell>
                      <TableCell className="text-gray-400">{formatFileSize(file.file_size)}</TableCell>
                      <TableCell className="text-gray-400">{file.download_count}</TableCell>
                      <TableCell className="text-gray-400">{formatDate(file.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleDownload(file)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            data-testid={`download-${file.id}`}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteFile(file.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            data-testid={`delete-file-${file.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}

        {activeTab === "leads" && (
          <div className="rounded-xl bg-[#121212] border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-lg font-semibold text-white">Lead Submissions</h2>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto" />
              </div>
            ) : leads.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No leads yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Email</TableHead>
                    <TableHead className="text-gray-400">Company</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Dataset</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="border-white/5">
                      <TableCell className="text-white font-medium">{lead.full_name}</TableCell>
                      <TableCell className="text-gray-400">{lead.work_email}</TableCell>
                      <TableCell className="text-gray-400">{lead.company}</TableCell>
                      <TableCell className="text-gray-400 capitalize">{lead.company_type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-gray-400">{lead.dataset_interest}</TableCell>
                      <TableCell className="text-gray-400">{formatDate(lead.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteLead(lead.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                          data-testid={`delete-lead-${lead.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-[#121212] border-white/10 text-white max-w-md" data-testid="upload-dialog">
          <DialogHeader>
            <DialogTitle>Upload Dataset File</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpload} className="space-y-4">
            {/* File Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="upload-zone rounded-lg p-8 text-center cursor-pointer"
            >
              {uploadData.file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-blue-400" />
                  <div className="text-left">
                    <p className="text-white font-medium">{uploadData.file.name}</p>
                    <p className="text-gray-500 text-sm">{formatFileSize(uploadData.file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadData({ ...uploadData, file: null });
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">Click to select file</p>
                  <p className="text-gray-600 text-sm">CSV, PDF, JSON, XLSX</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.pdf,.json,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="file-input"
            />

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-gray-300">Dataset Category *</Label>
              <Select
                value={uploadData.dataset_category}
                onValueChange={(value) => setUploadData({ ...uploadData, dataset_category: value })}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white" data-testid="upload-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  {datasetCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-white/10">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={uploadData.description}
                onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-600"
                placeholder="Optional description..."
                data-testid="upload-description"
              />
            </div>

            {/* Is Sample */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_sample"
                checked={uploadData.is_sample}
                onChange={(e) => setUploadData({ ...uploadData, is_sample: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-black/50 text-blue-500"
                data-testid="upload-is-sample"
              />
              <Label htmlFor="is_sample" className="text-gray-300">
                Available as sample download
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isUploading}
              className="w-full btn-primary"
              data-testid="upload-submit"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

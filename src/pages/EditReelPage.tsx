import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  X,
  History,
  RotateCcw,
  RefreshCw,
  FileText,
  Eye,
  Edit3,
  Check,
  X as XIcon,
  Clock,
  User,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reelApi, type ReelMetadata, type Transcript, type ReprocessStatus } from "@/lib/api/reels";
import { cn } from "@/lib/utils";

// Form validation schema
const metadataSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  tags: z.string().optional(),
  category: z.string().optional(),
  machineModel: z.string().optional(),
  tooling: z.string().optional(),
  processStep: z.string().optional(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.string().optional(),
  customerScope: z.string().optional(),
});

type MetadataFormData = z.infer<typeof metadataSchema>;

export default function EditReelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [reprocessStatus, setReprocessStatus] = useState<ReprocessStatus | null>(null);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editedTranscript, setEditedTranscript] = useState<Transcript | null>(null);

  // Fetch reel data
  const { data: reel, isLoading: isLoadingReel } = useQuery({
    queryKey: ["reel", id],
    queryFn: () => reelApi.getReel(id!),
    enabled: !!id,
  });

  // Fetch versions
  const { data: versions = [] } = useQuery({
    queryKey: ["reel-versions", id],
    queryFn: () => reelApi.getVersions(id!),
    enabled: !!id,
  });

  // Fetch transcript
  const { data: transcript } = useQuery({
    queryKey: ["reel-transcript", id],
    queryFn: () => reelApi.getTranscript(id!),
    enabled: !!id,
  });

  // Initialize form with reel data
  const form = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      category: "",
      machineModel: "",
      tooling: "",
      processStep: "",
      skillLevel: "beginner",
      language: "en",
      customerScope: "",
    },
  });

  // Update form when reel data loads
  useEffect(() => {
    if (reel) {
      form.reset({
        title: reel.title,
        description: reel.description || "",
        tags: reel.tags.join(", "),
        category: reel.category || "",
        machineModel: reel.machineModel || "",
        tooling: reel.tooling || "",
        processStep: reel.processStep || "",
        skillLevel: reel.skillLevel || "beginner",
        language: reel.language || "en",
        customerScope: reel.customerScope || "",
      });
    }
  }, [reel, form]);

  // Initialize transcript editing
  useEffect(() => {
    if (transcript) {
      setEditedTranscript(transcript);
    }
  }, [transcript]);

  // Update metadata mutation
  const updateMetadataMutation = useMutation({
    mutationFn: (data: MetadataFormData) => {
      const tagsArray = data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      return reelApi.updateMetadata(id!, {
        ...data,
        tags: tagsArray,
      });
    },
    onSuccess: () => {
      toast.success("Metadata updated successfully");
      queryClient.invalidateQueries({ queryKey: ["reel", id] });
      queryClient.invalidateQueries({ queryKey: ["reel-versions", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update metadata");
    },
  });

  // Update transcript mutation
  const updateTranscriptMutation = useMutation({
    mutationFn: (transcript: Transcript) => reelApi.updateTranscript(id!, transcript),
    onSuccess: () => {
      toast.success("Transcript updated successfully");
      setIsEditingTranscript(false);
      queryClient.invalidateQueries({ queryKey: ["reel-transcript", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update transcript");
    },
  });

  // Reprocess mutation
  const reprocessMutation = useMutation({
    mutationFn: () => reelApi.startReprocess(id!),
    onSuccess: (status) => {
      setReprocessStatus(status);
      setIsReprocessing(true);
      toast.loading("Video reprocessing started...", { id: "reprocess" });
      // Poll for status updates
      pollReprocessStatus(status.id);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to start reprocessing");
    },
  });

  // Poll reprocess status
  const pollReprocessStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await reelApi.getReprocessStatus(id!, jobId);
        setReprocessStatus(status);
        
        if (status.status === "completed") {
          clearInterval(interval);
          setIsReprocessing(false);
          toast.success("Video reprocessing completed", { id: "reprocess" });
          queryClient.invalidateQueries({ queryKey: ["reel", id] });
        } else if (status.status === "failed") {
          clearInterval(interval);
          setIsReprocessing(false);
          toast.error(status.message || "Reprocessing failed", { id: "reprocess" });
        }
      } catch (error) {
        clearInterval(interval);
        setIsReprocessing(false);
        toast.error("Failed to check reprocess status", { id: "reprocess" });
      }
    }, 2000);

    // Cleanup after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  };

  // Rollback mutation
  const rollbackMutation = useMutation({
    mutationFn: (versionId: string) => reelApi.rollbackVersion(id!, versionId),
    onSuccess: () => {
      toast.success("Rolled back to selected version");
      setIsVersionDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["reel", id] });
      queryClient.invalidateQueries({ queryKey: ["reel-versions", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to rollback version");
    },
  });

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: (permissions: ReelMetadata["permissions"]) => reelApi.updatePermissions(id!, permissions),
    onSuccess: () => {
      toast.success("Permissions updated successfully");
      queryClient.invalidateQueries({ queryKey: ["reel", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  // Handle form submission
  const onSubmit = (data: MetadataFormData) => {
    updateMetadataMutation.mutate(data);
  };

  // Handle transcript segment click (seek to time)
  const handleSegmentClick = (startTime: number) => {
    setCurrentTime(startTime);
    // In a real implementation, this would seek the video player
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoadingReel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading reel data...</p>
        </div>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Reel not found</p>
          <Button asChild>
            <Link to="/library">Back to Library</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with Breadcrumbs */}
          <header className="bg-background-surface border-b border-border px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/library">
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </Button>
                <div>
                  <nav className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                    <Link to="/library" className="hover:text-primary">Library</Link>
                    <span>/</span>
                    <span className="text-text-primary">Edit Reel</span>
                  </nav>
                  <h1 className="text-2xl font-bold">Edit Reel</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/reel/${id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={updateMetadataMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateMetadataMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Metadata Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Metadata</CardTitle>
                    <CardDescription>Edit reel information and details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            {...form.register("title")}
                            className={cn(form.formState.errors.title && "border-destructive")}
                          />
                          {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" {...form.register("category")} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            {...form.register("description")}
                            rows={4}
                            className={cn(form.formState.errors.description && "border-destructive")}
                          />
                          {form.formState.errors.description && (
                            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="machineModel">Machine Model</Label>
                          <Input id="machineModel" {...form.register("machineModel")} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tooling">Tooling</Label>
                          <Input id="tooling" {...form.register("tooling")} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="processStep">Process Step</Label>
                          <Input id="processStep" {...form.register("processStep")} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="skillLevel">Skill Level</Label>
                          <Select
                            value={form.watch("skillLevel")}
                            onValueChange={(value) => form.setValue("skillLevel", value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="language">Language</Label>
                          <Input id="language" {...form.register("language")} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customerScope">Customer Scope</Label>
                          <Input id="customerScope" {...form.register("customerScope")} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input id="tags" {...form.register("tags")} placeholder="setup, cnc, basics" />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Version History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Version History</CardTitle>
                        <CardDescription>View and manage reel versions</CardDescription>
                      </div>
                      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <History className="mr-2 h-4 w-4" />
                            View All Versions
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Version History</DialogTitle>
                            <DialogDescription>
                              Select a version to view details or rollback
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[400px]">
                            <div className="space-y-4">
                              {versions.map((version) => (
                                <div
                                  key={version.id}
                                  className={cn(
                                    "p-4 rounded-lg border",
                                    version.versionNumber === reel.currentVersion
                                      ? "border-primary bg-primary/5"
                                      : "border-border"
                                  )}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold">Version {version.versionNumber}</span>
                                      {version.versionNumber === reel.currentVersion && (
                                        <Badge variant="success">Current</Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-text-secondary">
                                      {new Date(version.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <p className="text-sm text-text-secondary mb-3">{version.changeLog}</p>
                                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <User className="h-3 w-3" />
                                    <span>{version.modifiedBy}</span>
                                    <Calendar className="h-3 w-3 ml-2" />
                                    <span>{new Date(version.createdAt).toLocaleString()}</span>
                                  </div>
                                  {version.versionNumber !== reel.currentVersion && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-3"
                                      onClick={() => rollbackMutation.mutate(version.id)}
                                      disabled={rollbackMutation.isPending}
                                    >
                                      <RotateCcw className="mr-2 h-3 w-3" />
                                      Rollback
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsVersionDialogOpen(false)}>
                              Close
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {versions.slice(0, 3).map((version) => (
                        <div
                          key={version.id}
                          className={cn(
                            "p-3 rounded-lg border",
                            version.versionNumber === reel.currentVersion
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">Version {version.versionNumber}</span>
                              {version.versionNumber === reel.currentVersion && (
                                <Badge variant="success" className="ml-2">Current</Badge>
                              )}
                            </div>
                            <span className="text-sm text-text-secondary">
                              {new Date(version.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">{version.changeLog}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reprocess/Transcode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Video Processing</CardTitle>
                    <CardDescription>Reprocess or transcode the video</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reprocessStatus && (
                        <div className="p-4 rounded-lg border border-border bg-muted/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Reprocessing Status</span>
                            <Badge
                              variant={
                                reprocessStatus.status === "completed"
                                  ? "success"
                                  : reprocessStatus.status === "failed"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {reprocessStatus.status}
                            </Badge>
                          </div>
                          {reprocessStatus.status === "processing" && (
                            <div className="mt-3">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${reprocessStatus.progress}%` }}
                                />
                              </div>
                              <p className="text-sm text-text-secondary mt-2">
                                {reprocessStatus.progress}% complete
                              </p>
                            </div>
                          )}
                          {reprocessStatus.message && (
                            <p className="text-sm text-text-secondary mt-2">{reprocessStatus.message}</p>
                          )}
                          {isReprocessing && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => {
                                if (reprocessStatus) {
                                  reelApi.cancelReprocess(id!, reprocessStatus.id);
                                  setIsReprocessing(false);
                                  setReprocessStatus(null);
                                  toast.info("Reprocessing cancelled");
                                }
                              }}
                            >
                              <XIcon className="mr-2 h-3 w-3" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => reprocessMutation.mutate()}
                        disabled={isReprocessing || reprocessMutation.isPending}
                      >
                        <RefreshCw className={cn("mr-2 h-4 w-4", isReprocessing && "animate-spin")} />
                        {isReprocessing ? "Reprocessing..." : "Start Reprocessing"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Transcript Editor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Transcript</CardTitle>
                        <CardDescription>Edit time-aligned transcript</CardDescription>
                      </div>
                      {!isEditingTranscript ? (
                        <Button variant="outline" onClick={() => setIsEditingTranscript(true)}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit Transcript
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (editedTranscript) {
                                updateTranscriptMutation.mutate(editedTranscript);
                              }
                            }}
                            disabled={updateTranscriptMutation.isPending}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditingTranscript(false);
                              setEditedTranscript(transcript || null);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editedTranscript ? (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {editedTranscript.segments.map((segment, index) => (
                            <div
                              key={segment.id}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-colors",
                                currentTime >= segment.startTime && currentTime < segment.endTime
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:bg-muted/50"
                              )}
                              onClick={() => handleSegmentClick(segment.startTime)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                  <span className="text-xs font-medium text-primary">
                                    {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                                  </span>
                                </div>
                                {isEditingTranscript ? (
                                  <Input
                                    value={segment.text}
                                    onChange={(e) => {
                                      const updated = { ...editedTranscript };
                                      updated.segments[index] = {
                                        ...segment,
                                        text: e.target.value,
                                      };
                                      setEditedTranscript(updated);
                                    }}
                                    className="flex-1"
                                  />
                                ) : (
                                  <p className="text-sm flex-1">{segment.text}</p>
                                )}
                                {segment.confidence && (
                                  <Badge variant="outline" className="text-xs">
                                    {Math.round(segment.confidence * 100)}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-12 text-text-secondary">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No transcript available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </div>

        {/* Sidebar - Permissions & Visibility */}
        <aside className="w-80 bg-background-surface border-l border-border p-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Permissions & Visibility</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">Visibility</Label>
                      <Select
                        value={reel.permissions.visibility}
                        onValueChange={(value) => {
                          updatePermissionsMutation.mutate({
                            ...reel.permissions,
                            visibility: value as any,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant">Tenant Only</SelectItem>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <Label className="mb-2 block">Access Level</Label>
                      <Select
                        value={reel.permissions.accessLevel}
                        onValueChange={(value) => {
                          updatePermissionsMutation.mutate({
                            ...reel.permissions,
                            accessLevel: value as any,
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="edit">Edit</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Status</Label>
                        <Badge variant="success">PUBLISHED</Badge>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Current version: {reel.currentVersion}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <span className="text-text-secondary">Duration:</span>
                  <span>0:25</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-text-secondary" />
                  <span className="text-text-secondary">Uploader:</span>
                  <span>John Doe</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  <span className="text-text-secondary">Created:</span>
                  <span>{new Date(reel.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  <span className="text-text-secondary">Updated:</span>
                  <span>{new Date(reel.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

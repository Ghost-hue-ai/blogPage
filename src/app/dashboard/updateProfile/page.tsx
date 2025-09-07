"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Heart,
  GraduationCap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

// Form data type for text-based fields
type ProfileFormData = {
  // Basic Information
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  dateOfBirth?: string;
  gender?: string;

  // Contact Information
  email?: string;
  phone?: string;
  alternateEmail?: string;
  website?: string;

  // Location
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  address?: string;

  // Professional
  jobTitle?: string;
  company?: string;
  industry?: string;
  experience?: string;
  workDescription?: string;

  // Education
  education?: string;
  fieldOfStudy?: string;
  school?: string;
  graduationYear?: number;

  // Social Media
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  portfolio?: string;

  // Personal
  relationshipStatus?: string;
  languages?: string;
  interests?: string;
  bio?: string;
  favoriteQuote?: string;

  // Privacy
  profilePublic?: boolean;
  showEmail?: boolean;
  allowMessages?: boolean;
  emailNotifications?: boolean;
};

// Profile image state type
type ProfileImageState = {
  url: string;
  uploading: boolean;
  file: File | null;
};

export default function UpdateProfilePage() {
  // Separate state for profile image
  const [profileImageState, setProfileImageState] = useState<ProfileImageState>(
    {
      url: "",
      uploading: false,
      file: null,
    }
  );

  const { data: session, status } = useSession();
  const { isCollapsed } = useSidebar();

  // React Hook Form for text-based data
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      profilePublic: true,
      showEmail: false,
      allowMessages: true,
      emailNotifications: true,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageState((prev) => ({ ...prev, uploading: true, file }));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await axios.post("/api/user/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status >= 200 && result.status < 300) {
        setProfileImageState((prev) => ({
          ...prev,
          url: result.data.url,
          uploading: false,
        }));
        toast("Profile picture updated successfully!");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";
      toast("Failed to update profile pic", {
        description: message,
      });
      setProfileImageState((prev) => ({ ...prev, uploading: false }));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("Form Data:", data);
      console.log("Profile Image State:", profileImageState);

      const res = await axios.post(`/api/user/user-data/${session?.user._id}`, {
        data,
      });
      if (res) {
        console.log(res);
      }

      toast("Profile updated successfully!", {
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      console.error("Profile update failed:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile";
      toast("Profile update failed", {
        description: message,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 transition-all duration-300 dark:bg-[#1A1C2B]"
      style={{
        marginLeft: isCollapsed ? "80px" : "300px",
      }}
    >
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
            Update Your Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personalize your profile with the information you'd like to share.
            All fields are optional.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture Section */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="flex items-center justify-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 pt-4">
              <div className="relative group">
                <Avatar className="w-40 h-40 ring-4 ring-white shadow-2xl transition-all duration-300 group-hover:ring-blue-200">
                  <AvatarImage
                    src={profileImageState.url}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    <User className="w-16 h-16 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
                {profileImageState.uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {profileImageState.uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Change Picture
                      </>
                    )}
                  </Label>
                </div>
                <p className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("lastName")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-gray-700"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("username")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="displayName"
                  className="text-sm font-semibold text-gray-700"
                >
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  placeholder="How should others see your name?"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("displayName")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-sm font-semibold text-gray-700"
                >
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900"
                  {...register("dateOfBirth")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="text-sm font-semibold text-gray-700"
                >
                  Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900">
                        <SelectValue
                          placeholder="Select gender"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                        <SelectItem
                          value="male"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="non-binary"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Non-binary
                        </SelectItem>
                        <SelectItem
                          value="prefer-not-to-say"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("email")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("phone")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="alternateEmail"
                  className="text-sm font-semibold text-gray-700"
                >
                  Alternate Email
                </Label>
                <Input
                  id="alternateEmail"
                  type="email"
                  placeholder="backup@example.com"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("alternateEmail")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="text-sm font-semibold text-gray-700"
                >
                  Personal Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("website")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="country"
                  className="text-sm font-semibold text-gray-700"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="United States"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("country")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="state"
                  className="text-sm font-semibold text-gray-700"
                >
                  State/Province
                </Label>
                <Input
                  id="state"
                  placeholder="California"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("state")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="city"
                  className="text-sm font-semibold text-gray-700"
                >
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="San Francisco"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("city")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="zipCode"
                  className="text-sm font-semibold text-gray-700"
                >
                  ZIP/Postal Code
                </Label>
                <Input
                  id="zipCode"
                  placeholder="94102"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("zipCode")}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-semibold text-gray-700"
                >
                  Street Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Apt 4B"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("address")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="jobTitle"
                  className="text-sm font-semibold text-gray-700"
                >
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("jobTitle")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-sm font-semibold text-gray-700"
                >
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Tech Corp Inc."
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("company")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="industry"
                  className="text-sm font-semibold text-gray-700"
                >
                  Industry
                </Label>
                <Input
                  id="industry"
                  placeholder="Technology"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("industry")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="experience"
                  className="text-sm font-semibold text-gray-700"
                >
                  Years of Experience
                </Label>
                <Controller
                  name="experience"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900">
                        <SelectValue
                          placeholder="Select experience"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                        <SelectItem
                          value="0-1"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          0-1 years
                        </SelectItem>
                        <SelectItem
                          value="2-5"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          2-5 years
                        </SelectItem>
                        <SelectItem
                          value="6-10"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          6-10 years
                        </SelectItem>
                        <SelectItem
                          value="11-15"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          11-15 years
                        </SelectItem>
                        <SelectItem
                          value="16+"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          16+ years
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="workDescription"
                  className="text-sm font-semibold text-gray-700"
                >
                  Work Description
                </Label>
                <Textarea
                  id="workDescription"
                  placeholder="Describe what you do at work..."
                  rows={3}
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500 resize-none"
                  {...register("workDescription")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="education"
                  className="text-sm font-semibold text-gray-700"
                >
                  Highest Education
                </Label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900">
                        <SelectValue
                          placeholder="Select education level"
                          className="text-gray-500"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                        <SelectItem
                          value="high-school"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          High School
                        </SelectItem>
                        <SelectItem
                          value="associate"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Associate Degree
                        </SelectItem>
                        <SelectItem
                          value="bachelor"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Bachelor's Degree
                        </SelectItem>
                        <SelectItem
                          value="master"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Master's Degree
                        </SelectItem>
                        <SelectItem
                          value="doctorate"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Doctorate
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="fieldOfStudy"
                  className="text-sm font-semibold text-gray-700"
                >
                  Field of Study
                </Label>
                <Input
                  id="fieldOfStudy"
                  placeholder="Computer Science"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("fieldOfStudy")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="school"
                  className="text-sm font-semibold text-gray-700"
                >
                  School/University
                </Label>
                <Input
                  id="school"
                  placeholder="University of California"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("school")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="graduationYear"
                  className="text-sm font-semibold text-gray-700"
                >
                  Graduation Year
                </Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="2020"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("graduationYear", { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media & Links */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Social Media & Links
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="text-sm font-semibold text-gray-700"
                >
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("linkedin")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="text-sm font-semibold text-gray-700"
                >
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("twitter")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="github"
                  className="text-sm font-semibold text-gray-700"
                >
                  GitHub
                </Label>
                <Input
                  id="github"
                  placeholder="https://github.com/username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("github")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="text-sm font-semibold text-gray-700"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("instagram")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="facebook"
                  className="text-sm font-semibold text-gray-700"
                >
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/username"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("facebook")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="portfolio"
                  className="text-sm font-semibold text-gray-700"
                >
                  Portfolio
                </Label>
                <Input
                  id="portfolio"
                  placeholder="https://yourportfolio.com"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("portfolio")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="relationshipStatus"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Relationship Status
                  </Label>
                  <Controller
                    name="relationshipStatus"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900">
                          <SelectValue
                            placeholder="Select status"
                            className="text-gray-500"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                          <SelectItem
                            value="single"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            Single
                          </SelectItem>
                          <SelectItem
                            value="in-relationship"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            In a relationship
                          </SelectItem>
                          <SelectItem
                            value="married"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            Married
                          </SelectItem>
                          <SelectItem
                            value="divorced"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            Divorced
                          </SelectItem>
                          <SelectItem
                            value="widowed"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            Widowed
                          </SelectItem>
                          <SelectItem
                            value="complicated"
                            className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900"
                          >
                            It's complicated
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="languages"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Languages Spoken
                  </Label>
                  <Input
                    id="languages"
                    placeholder="English, Spanish, French..."
                    className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                    {...register("languages")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="interests"
                  className="text-sm font-semibold text-gray-700"
                >
                  Interests & Hobbies
                </Label>
                <Textarea
                  id="interests"
                  placeholder="Tell us about your interests, hobbies, and what you enjoy doing..."
                  rows={3}
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500 resize-none"
                  {...register("interests")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="bio"
                  className="text-sm font-semibold text-gray-700"
                >
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Write a short bio about yourself..."
                  rows={4}
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500 resize-none"
                  {...register("bio")}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="favoriteQuote"
                  className="text-sm font-semibold text-gray-700"
                >
                  Favorite Quote
                </Label>
                <Input
                  id="favoriteQuote"
                  placeholder="Share your favorite quote or motto"
                  className="bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-500"
                  {...register("favoriteQuote")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                <div className="p-2 bg-gradient-to-r from-slate-500 to-gray-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="profilePublic"
                  className="rounded"
                  {...register("profilePublic")}
                />
                <Label
                  htmlFor="profilePublic"
                  className="text-sm font-semibold text-gray-700"
                >
                  Make my profile public
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showEmail"
                  className="rounded"
                  {...register("showEmail")}
                />
                <Label
                  htmlFor="showEmail"
                  className="text-sm font-semibold text-gray-700"
                >
                  Show my email to other users
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowMessages"
                  className="rounded"
                  {...register("allowMessages")}
                />
                <Label
                  htmlFor="allowMessages"
                  className="text-sm font-semibold text-gray-700"
                >
                  Allow other users to message me
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="rounded"
                  {...register("emailNotifications")}
                />
                <Label
                  htmlFor="emailNotifications"
                  className="text-sm font-semibold text-gray-700"
                >
                  Receive email notifications
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center space-x-6 pt-8 pb-12">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="px-12 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Updating Profile...
                </>
              ) : (
                <>
                  <User className="w-5 h-5 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

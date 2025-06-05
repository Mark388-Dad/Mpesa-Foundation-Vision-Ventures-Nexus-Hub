
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Save, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { profile, user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    phoneNumber: '',
    admissionNumber: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  
  // Loading state
  if (loading) {
    return <div className="academy-container py-16 text-center">Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!profile || !user) {
    toast.error("You need to be logged in to access your profile");
    return <Navigate to="/auth" />;
  }

  // Get enterprise and category info if user is enterprise member
  const { data: enterpriseInfo } = useQuery({
    queryKey: ['user-enterprise-info', profile.enterpriseId],
    queryFn: async () => {
      if (!profile.enterpriseId) return null;
      
      const { data, error } = await supabase
        .from('enterprises')
        .select('*, enterprise_categories(*)')
        .eq('id', profile.enterpriseId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!profile.enterpriseId
  });

  // Initialize form data
  useState(() => {
    setFormData({
      username: profile.username || '',
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      admissionNumber: profile.admissionNumber || ''
    });
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updateData: any) => {
      let avatarUrl = profile.avatarUrl;
      
      // Upload avatar if new file selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-avatar.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatarUrl = publicUrl;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: updateData.username,
          full_name: updateData.fullName,
          phone_number: updateData.phoneNumber,
          admission_number: updateData.admissionNumber,
          avatar_url: avatarUrl
        })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setAvatarFile(null);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionTitle = () => {
    if (profile.role === 'staff') return 'Staff Member';
    if (profile.role === 'enterprise' && enterpriseInfo) return `${enterpriseInfo.name} Owner`;
    if (profile.role === 'student') return 'Student';
    return 'User';
  };

  return (
    <div className="academy-container py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={updateProfileMutation.isPending}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl} 
                    alt={profile.fullName || profile.username || 'User'} 
                  />
                  <AvatarFallback className="text-lg">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {profile.fullName || profile.username || 'Unnamed User'}
                </h3>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getRoleColor(profile.role)}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {getPositionTitle()}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              {profile.role === 'student' && (
                <div>
                  <Label htmlFor="admissionNumber">Admission Number</Label>
                  <Input
                    id="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData({...formData, admissionNumber: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>

            {/* Enterprise Information */}
            {profile.role === 'enterprise' && enterpriseInfo && (
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold mb-4">Enterprise Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Enterprise Name</Label>
                    <Input value={enterpriseInfo.name} disabled className="bg-gray-50" />
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl">{enterpriseInfo.enterprise_categories?.icon}</span>
                      <Input 
                        value={enterpriseInfo.enterprise_categories?.name || 'Uncategorized'} 
                        disabled 
                        className="bg-gray-50" 
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input value={enterpriseInfo.description} disabled className="bg-gray-50" />
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4">Account Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Member Since</Label>
                  <Input 
                    value={new Date(profile.createdAt).toLocaleDateString()} 
                    disabled 
                    className="bg-gray-50" 
                  />
                </div>
                
                <div>
                  <Label>Last Updated</Label>
                  <Input 
                    value={new Date(profile.updatedAt).toLocaleDateString()} 
                    disabled 
                    className="bg-gray-50" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

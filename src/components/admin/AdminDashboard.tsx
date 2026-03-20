import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  FileText,
  Mail,
  Phone,
  LayoutDashboard,
  Settings,
  ChevronRight,
  User,
  Inbox,
  Archive,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Reply,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Blog {
  id: string;
  slug: string;
  headline: string;
  excerpt: string;
  tag: string;
  writer: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
}

interface ContactSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  message?: string;
  created_at: string;
}

interface Contract {
  id: number;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  subject: string;
  message: string;
  service_type?: string;
  status: 'unread' | 'read' | 'pending' | 'approved' | 'rejected' | 'completed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  read_at?: string;
  replied_at?: string;
  notes?: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'blogs' | 'contacts' | 'contracts'>('dashboard');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const [contractNotes, setContractNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    checkAuth();
    loadBlogs();
    loadContacts();
    loadContracts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    setUser(session.user);
  };

  const loadBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contact submissions');
    }
  };

  const loadContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('Failed to load contracts');
    }
  };

  const handleContractClick = async (contract: Contract) => {
    setSelectedContract(contract);
    setContractNotes(contract.notes || '');
    setIsContractDialogOpen(true);

    // Mark as read if unread
    if (contract.status === 'unread') {
      try {
        const { error } = await supabase
          .from('contracts')
          .update({ status: 'read', read_at: new Date().toISOString() })
          .eq('id', contract.id);

        if (error) throw error;
        loadContracts();
      } catch (error) {
        console.error('Error updating contract status:', error);
      }
    }
  };

  const handleUpdateContractStatus = async (id: number, newStatus: Contract['status']) => {
    try {
      const updates: Partial<Contract> = { status: newStatus };
      if (newStatus === 'completed' || newStatus === 'approved' || newStatus === 'rejected') {
        updates.replied_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success(`Contract marked as ${newStatus}`);
      loadContracts();
      setIsContractDialogOpen(false);
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('Failed to update contract');
    }
  };

  const handleSaveContractNotes = async () => {
    if (!selectedContract) return;

    try {
      const { error } = await supabase
        .from('contracts')
        .update({ notes: contractNotes })
        .eq('id', selectedContract.id);

      if (error) throw error;
      toast.success('Notes saved');
      loadContracts();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const handleDeleteContract = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contract deleted');
      loadContracts();
      setIsContractDialogOpen(false);
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error('Failed to delete contract');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Blog deleted');
      loadBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    }
  };

  const handleToggleStatus = async (blog: Blog) => {
    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    const publishedAt = newStatus === 'published' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('blogs')
        .update({ status: newStatus, published_at: publishedAt })
        .eq('id', blog.id);

      if (error) throw error;
      toast.success(`Blog ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      loadBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Contact submission deleted');
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact submission');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.writer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'published').length,
    drafts: blogs.filter(b => b.status === 'draft').length,
  };

  const contactStats = {
    total: contacts.length,
    today: contacts.filter(c => {
      const today = new Date().toDateString();
      const contactDate = new Date(c.created_at).toDateString();
      return today === contactDate;
    }).length,
    thisWeek: contacts.filter(c => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.created_at) >= weekAgo;
    }).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Admin Panel</span>
                <span className="text-xs text-muted-foreground">Smart Study</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'dashboard'}
                  onClick={() => setActiveSection('dashboard')}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'blogs'}
                  onClick={() => setActiveSection('blogs')}
                  tooltip="Blogs"
                >
                  <FileText className="h-4 w-4" />
                  <span>Blogs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'contacts'}
                  onClick={() => setActiveSection('contacts')}
                  tooltip="Contacts"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contacts</span>
                  {contacts.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {contacts.length}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === 'contracts'}
                  onClick={() => setActiveSection('contracts')}
                  tooltip="Contracts"
                >
                  <Inbox className="h-4 w-4" />
                  <span>Contracts</span>
                  {contracts.filter(c => c.status === 'unread').length > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {contracts.filter(c => c.status === 'unread').length}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-4" />

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user?.email}</span>
                <span className="text-xs text-muted-foreground">Administrator</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'blogs' && 'Blog Management'}
                {activeSection === 'contacts' && 'Contact Submissions'}
                {activeSection === 'contracts' && 'Contracts Inbox'}
              </h1>
            </div>
            {activeSection === 'blogs' && (
              <Button onClick={() => navigate('/admin/blog/new')}>
                <Plus className="h-4 w-4 mr-2" />
                New Blog
              </Button>
            )}
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 bg-primary/5 rounded-bl-3xl" />
                    <CardHeader className="pb-2">
                      <CardDescription>Total Blogs</CardDescription>
                      <CardTitle className="text-3xl">{stats.total}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>All blog posts</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 bg-green-500/5 rounded-bl-3xl" />
                    <CardHeader className="pb-2">
                      <CardDescription>Published</CardDescription>
                      <CardTitle className="text-3xl text-green-600">{stats.published}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>Live articles</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-20 w-20 bg-yellow-500/5 rounded-bl-3xl" />
                    <CardHeader className="pb-2">
                      <CardDescription>Drafts</CardDescription>
                      <CardTitle className="text-3xl text-yellow-600">{stats.drafts}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Pending review</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Contacts</CardDescription>
                      <CardTitle className="text-3xl">{contactStats.total}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">All submissions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Today</CardDescription>
                      <CardTitle className="text-3xl text-blue-600">{contactStats.today}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">New today</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>This Week</CardDescription>
                      <CardTitle className="text-3xl text-green-600">{contactStats.thisWeek}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Last 7 days</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveSection('blogs')}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">Manage Blogs</CardTitle>
                          <CardDescription>Create, edit and publish articles</CardDescription>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                      </div>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveSection('contacts')}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">View Contacts</CardTitle>
                          <CardDescription>Check contact submissions</CardDescription>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === 'blogs' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 max-w-md"
                  />
                </div>

                {/* Blog Table */}
                <Card>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-4 font-medium">Blog</th>
                          <th className="text-left p-4 font-medium">Author</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Date</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBlogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-muted-foreground">
                              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No blogs found</p>
                              {searchQuery && <p className="text-sm">Try adjusting your search</p>}
                            </td>
                          </tr>
                        ) : (
                          filteredBlogs.map((blog) => (
                            <tr key={blog.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{blog.headline}</p>
                                  <p className="text-sm text-muted-foreground">/{blog.slug}</p>
                                  {blog.tag && (
                                    <Badge variant="secondary" className="mt-1">{blog.tag}</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm">{blog.writer}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge
                                  variant={blog.status === 'published' ? 'default' : 'secondary'}
                                  className={blog.status === 'published' ? 'bg-green-600' : ''}
                                >
                                  {blog.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <p className="text-sm text-muted-foreground">
                                  {blog.published_at
                                    ? new Date(blog.published_at).toLocaleDateString()
                                    : new Date(blog.created_at).toLocaleDateString()}
                                </p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleStatus(blog)}
                                    title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                  >
                                    {blog.status === 'published' ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/admin/blog/edit/${blog.id}`)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(blog.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {activeSection === 'contacts' && (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 max-w-md"
                  />
                </div>

                {/* Contacts Grid */}
                {filteredContacts.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No contact submissions found</p>
                    {searchQuery && <p className="text-sm text-muted-foreground mt-2">Try adjusting your search</p>}
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContacts.map((contact) => (
                      <Card key={contact.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base font-medium">
                                  {contact.first_name} {contact.last_name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1 text-xs">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </CardDescription>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-600 hover:text-red-700 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{contact.phone}</span>
                          </div>
                          {contact.country && (
                            <p className="text-sm text-muted-foreground">{contact.country}</p>
                          )}
                          {contact.services && contact.services.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {contact.services.map((service, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {contact.message && (
                            <p className="text-sm text-muted-foreground line-clamp-3 bg-muted/50 p-2 rounded-md">
                              "{contact.message}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Submitted on {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'contracts' && (
              <div className="space-y-4">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contracts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Contracts Stats */}
                <div className="flex gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Inbox className="h-3 w-3 mr-1" />
                    Unread: {contracts.filter(c => c.status === 'unread').length}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending: {contracts.filter(c => c.status === 'pending').length}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed: {contracts.filter(c => c.status === 'completed').length}
                  </Badge>
                </div>

                {/* Contracts Inbox List */}
                <Card>
                  <div className="divide-y">
                    {contracts.length === 0 ? (
                      <div className="p-8 text-center">
                        <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">No contracts found</p>
                        <p className="text-sm text-muted-foreground mt-2">New contract requests will appear here</p>
                      </div>
                    ) : (
                      contracts.map((contract) => (
                        <div
                          key={contract.id}
                          onClick={() => handleContractClick(contract)}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            contract.status === 'unread' ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className={`text-sm ${
                                contract.status === 'unread' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                {contract.sender_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-semibold truncate ${
                                  contract.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {contract.sender_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(contract.created_at).toLocaleDateString()}
                                </span>
                                {contract.priority === 'urgent' && (
                                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                )}
                                {contract.priority === 'high' && (
                                  <Badge variant="default" className="text-xs bg-orange-500">High</Badge>
                                )}
                              </div>
                              <h4 className={`text-sm mb-1 ${
                                contract.status === 'unread' ? 'font-semibold' : 'font-medium'
                              }`}>
                                {contract.subject}
                              </h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {contract.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge 
                                  variant={contract.status === 'unread' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {contract.status}
                                </Badge>
                                {contract.service_type && (
                                  <span className="text-xs text-muted-foreground">
                                    {contract.service_type}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteContract(contract.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>

      {/* Contract Detail Dialog */}
      <Dialog open={isContractDialogOpen} onOpenChange={setIsContractDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {selectedContract?.sender_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle>{selectedContract?.subject}</DialogTitle>
                <DialogDescription>
                  From: {selectedContract?.sender_name} ({selectedContract?.sender_email})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-4 py-4">
              {/* Contract Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Received:</span>
                  <p className="font-medium">
                    {selectedContract && new Date(selectedContract.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge 
                    variant={selectedContract?.status === 'unread' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {selectedContract?.status}
                  </Badge>
                </div>
                {selectedContract?.sender_phone && (
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p className="font-medium">{selectedContract.sender_phone}</p>
                  </div>
                )}
                {selectedContract?.service_type && (
                  <div>
                    <span className="text-muted-foreground">Service Type:</span>
                    <p className="font-medium">{selectedContract.service_type}</p>
                  </div>
                )}
              </div>

              {/* Priority */}
              {selectedContract?.priority && selectedContract.priority !== 'normal' && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">
                    {selectedContract.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
              )}

              {/* Message */}
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="text-sm font-semibold mb-2">Message:</h5>
                <p className="text-sm whitespace-pre-wrap">{selectedContract?.message}</p>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <h5 className="text-sm font-semibold">Admin Notes:</h5>
                <Textarea
                  value={contractNotes}
                  onChange={(e) => setContractNotes(e.target.value)}
                  placeholder="Add notes about this contract..."
                  className="min-h-[100px]"
                />
                <Button onClick={handleSaveContractNotes} variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Save Notes
                </Button>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => selectedContract && handleUpdateContractStatus(selectedContract.id, 'pending')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark Pending
              </Button>
              <Button
                variant="default"
                onClick={() => selectedContract && handleUpdateContractStatus(selectedContract.id, 'approved')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => selectedContract && handleUpdateContractStatus(selectedContract.id, 'rejected')}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                variant="secondary"
                onClick={() => selectedContract && handleUpdateContractStatus(selectedContract.id, 'completed')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

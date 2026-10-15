"use client";

import { useRole } from "@/hooks/useRole";
import MainLayout from "@/ui/templates/MainLayout";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Result,
  Select,
  Skeleton,
  Tag,
  Tooltip,
} from "antd";
import Cookies from "js-cookie";
import {
  Copy,
  KeyRound,
  Mail,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const ROLES = [
  { value: "superadmin", label: "Super Admin", color: "purple" },
  { value: "admin", label: "Admin", color: "red" },
  { value: "staff", label: "Staff", color: "blue" },
];

const roleMeta = (r) =>
  ROLES.find((x) => x.value === r) || { label: r, color: "default" };

export default function UsersPage() {
  const { isAdmin, loading: roleLoading } = useRole();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [created, setCreated] = useState(null);
  const [form] = Form.useForm();

  const authHeader = () => {
    const token = Cookies.get("token") || "dev-token-123";
    return { Authorization: `Bearer ${token}` };
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { headers: authHeader() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setUsers(json.data || []);
    } catch (err) {
      toast.error(err.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const genPassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$";
    let p = "";
    for (let i = 0; i < 10; i++)
      p += chars[Math.floor(Math.random() * chars.length)];
    form.setFieldsValue({ password: p });
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      setCreated({ email: values.email, password: values.password });
      setOpen(false);
      form.resetFields();
      loadUsers();
      toast.success("User created");
    } catch (err) {
      if (err?.errorFields) return;
      toast.error(err.message || "Could not create user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success("User removed");
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Could not remove user.");
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (roleLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-gray-400">Checking access…</div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <Result
            status="403"
            title="Access restricted"
            subTitle="Only administrators can manage users."
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create logins for team members and assign their role.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              allowClear
              prefix={<Search size={15} className="text-gray-400" />}
              placeholder="Search name, email or role"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Tooltip title="Refresh">
              <Button icon={<RefreshCw size={15} />} onClick={loadUsers} />
            </Tooltip>
            <Button
              type="primary"
              icon={<UserPlus size={16} />}
              onClick={() => {
                form.resetFields();
                form.setFieldsValue({ role: "staff" });
                setOpen(true);
              }}
            >
              Create user
            </Button>
          </div>
        </div>

        {created && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2 font-medium text-green-800">
              <Shield size={16} /> User created — share these credentials
            </div>
            <p className="mb-3 text-sm text-green-700">
              This password is shown only once. Copy it and send it to the user
              securely.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                <Mail size={14} className="text-gray-400" />
                {created.email}
                <button onClick={() => copy(created.email)}>
                  <Copy size={14} className="text-gray-400 hover:text-gray-700" />
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                <KeyRound size={14} className="text-gray-400" />
                <span className="font-mono">{created.password}</span>
                <button onClick={() => copy(created.password)}>
                  <Copy size={14} className="text-gray-400 hover:text-gray-700" />
                </button>
              </div>
            </div>
            <button
              onClick={() => setCreated(null)}
              className="mt-3 text-xs text-green-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-4">
                <Skeleton active paragraph={{ rows: 1 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white py-16">
            <Empty description="No users yet." />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Mobile</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const meta = roleMeta(u.role);
                  return (
                    <tr
                      key={u.id || u._id}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{u.email}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {u.mobile || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Tag color={meta.color}>{meta.label}</Tag>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Popconfirm
                          title="Remove this user?"
                          description="Their login will stop working immediately."
                          okText="Remove"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleDelete(u.id || u._id)}
                        >
                          <Button size="small" danger icon={<Trash2 size={14} />} />
                        </Popconfirm>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          title="Create user"
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleCreate}
          okText="Create user"
          confirmLoading={saving}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" className="mt-4">
            <Form.Item
              name="name"
              label="Full name"
              rules={[{ required: true, message: "Enter the name" }]}
            >
              <Input placeholder="Priya Sharma" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email (their login)"
              rules={[
                { required: true, message: "Enter an email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="priya@leatherssc.org" />
            </Form.Item>

            <Form.Item name="mobile" label="Mobile (optional)">
              <Input placeholder="9876543210" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Enter or generate a password" },
                { min: 6, message: "At least 6 characters" },
              ]}
            >
              <Input
                placeholder="Set a password"
                addonAfter={
                  <button
                    type="button"
                    onClick={genPassword}
                    className="text-xs text-blue-600"
                  >
                    Generate
                  </button>
                }
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Pick a role" }]}
            >
              <Select
                options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
                placeholder="Select role"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}
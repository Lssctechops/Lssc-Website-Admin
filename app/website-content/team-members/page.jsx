"use client";

import { useRole } from "@/hooks/useRole";
import {
  createTeamMember,
  deleteTeamMember,
  fetchTeamMembers,
  updateTeamMember,
} from "@/redux/slice/team-members-slice";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Skeleton,
  Switch,
  Tooltip,
} from "antd";
import {
  Eye,
  EyeOff,
  Linkedin,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function TeamMembersPage() {
  const dispatch = useDispatch();
  const { canEditProtected: canEdit } = useRole();
  const { members, loading, saving } = useSelector(
    (state) => state.teamMembers
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  const imageUrl = Form.useWatch("image", form);

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      isCeo: false,
      order: (members?.length || 0) + 1,
    });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      designation: record.designation,
      email: record.email,
      mobile: record.mobile,
      linkedin: record.linkedin,
      image: record.image,
      order: record.order,
      isActive: record.isActive ?? true,
      isCeo: record.isCeo ?? false,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const id = editing?._id || editing?.id;
      if (editing) {
        await dispatch(updateTeamMember({ id, payload: values })).unwrap();
        toast.success("Member updated");
      } else {
        await dispatch(createTeamMember(values)).unwrap();
        toast.success("Member added");
      }
      setOpen(false);
      form.resetFields();
      dispatch(fetchTeamMembers());
    } catch (error) {
      if (error?.errorFields) return;
      toast.error(error?.message || "Could not save. Try again.");
    }
  };

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteTeamMember(record._id || record.id)).unwrap();
      toast.success("Member removed");
    } catch (error) {
      toast.error(error?.message || "Could not remove member.");
    }
  };

  const toggleActive = async (record) => {
    const next = !(record.isActive ?? true);
    try {
      await dispatch(
        updateTeamMember({
          id: record._id || record.id,
          payload: { ...record, isActive: next },
        })
      ).unwrap();
      toast.success(next ? "Now showing on website" : "Hidden from website");
    } catch (error) {
      toast.error(error?.message || "Could not update visibility.");
    }
  };

  const sorted = useMemo(
    () => [...(members || [])].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [members]
  );

  const ceo = sorted.find((m) => m.isCeo);

  const list = useMemo(() => {
    let out = sorted.filter((m) => !m.isCeo);
    const q = search.trim().toLowerCase();
    if (!q) return out;
    return out.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
    );
  }, [sorted, search]);

  const Contacts = ({ m, className = "" }) => (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {m.email && (
        <Tooltip title={m.email}>
          <a
            href={`mailto:${m.email}`}
            className="text-gray-400 hover:text-blue-600"
          >
            <Mail size={16} />
          </a>
        </Tooltip>
      )}
      {m.mobile && (
        <Tooltip title={m.mobile}>
          <a
            href={`tel:${m.mobile}`}
            className="text-gray-400 hover:text-green-600"
          >
            <Phone size={16} />
          </a>
        </Tooltip>
      )}
      {m.linkedin && (
        <Tooltip title="LinkedIn">
          <a
            href={m.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-700"
          >
            <Linkedin size={16} />
          </a>
        </Tooltip>
      )}
    </div>
  );

  const MemberCard = ({ m }) => {
    const active = m.isActive ?? true;
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          active ? "border-gray-200" : "border-dashed border-gray-300"
        }`}
      >
        <span className="absolute left-3 top-3 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
          #{m.order ?? "-"}
        </span>
        {!active && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            Hidden
          </span>
        )}

        <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100">
          {m.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={m.image}
              alt={m.name}
              className={`h-full w-full object-cover object-top ${
                active ? "" : "opacity-40 grayscale"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <User size={26} />
            </div>
          )}
        </div>

        <h3 className="truncate font-semibold text-gray-900">{m.name}</h3>
        <p className="mt-1 min-h-[40px] text-sm text-gray-500">
          {m.designation}
        </p>

        <Contacts m={m} className="mt-2" />

        {canEdit && (
          <div className="mt-4 flex justify-center gap-2 border-t pt-3">
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<Pencil size={14} />}
                onClick={() => openEdit(m)}
              />
            </Tooltip>
            <Tooltip title={active ? "Hide" : "Show"}>
              <Button
                size="small"
                icon={active ? <EyeOff size={14} /> : <Eye size={14} />}
                onClick={() => toggleActive(m)}
              />
            </Tooltip>
            <Popconfirm
              title="Remove this member?"
              okText="Remove"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() => handleDelete(m)}
            >
              <Button size="small" danger icon={<Trash2 size={14} />} />
            </Popconfirm>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Our Team</h1>
          <p className="mt-1 text-sm text-gray-500">
            {canEdit
              ? 'Team members shown in the "Meet Our Team" section of the website.'
              : "View only — you don't have permission to edit these."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 ring-1 ring-gray-200">
              {sorted.length} total
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700 ring-1 ring-green-200">
              {sorted.filter((m) => m.isActive ?? true).length} live
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            allowClear
            prefix={<Search size={15} className="text-gray-400" />}
            placeholder="Search name or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Tooltip title="Refresh">
            <Button
              icon={<RefreshCw size={15} />}
              onClick={() => dispatch(fetchTeamMembers())}
            />
          </Tooltip>
          {canEdit && (
            <Button type="primary" icon={<Plus size={16} />} onClick={openAdd}>
              Add member
            </Button>
          )}
        </div>
      </div>

      {/* CEO */}
      <div className="mb-6 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-700">
          <Star size={16} />
          Featured (CEO card)
        </div>
        {ceo ? (
          <div className="flex flex-wrap items-center gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-indigo-100">
              {ceo.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ceo.image}
                  alt={ceo.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-500">
                  <User size={26} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {ceo.name}
              </h2>
              <p className="text-sm text-gray-600">{ceo.designation}</p>
              <Contacts m={ceo} className="mt-2 !justify-start" />
            </div>
            {canEdit && (
              <Button
                className="ml-auto"
                icon={<Pencil size={15} />}
                onClick={() => openEdit(ceo)}
              >
                Edit
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {canEdit
                ? "No featured member. Add one and turn on the CEO switch."
                : "No featured member."}
            </p>
            {canEdit && (
              <Button icon={<Plus size={15} />} onClick={openAdd}>
                Set featured
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-5 text-center">
              <Skeleton.Avatar active size={96} className="!mb-3" />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16">
          <Empty
            description={
              search ? "No members match this search." : "No members yet."
            }
          >
            {canEdit && !search && (
              <Button type="primary" icon={<Plus size={16} />} onClick={openAdd}>
                Add member
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m) => (
            <MemberCard key={m._id || m.id} m={m} />
          ))}
        </div>
      )}

      {/* Modal (only mounts for editors) */}
      {canEdit && (
        <Modal
          title={editing ? "Edit member" : "Add member"}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={handleSubmit}
          okText={editing ? "Save changes" : "Add member"}
          confirmLoading={saving}
          destroyOnHidden
          width={680}
        >
          <Form form={form} layout="vertical" className="mt-4">
            <div className="flex gap-5">
              <div className="shrink-0">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-28 w-28 rounded-full border object-cover object-top"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed text-gray-300">
                    <User size={26} />
                  </div>
                )}
              </div>
              <div className="grow">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Enter the name" }]}
                >
                  <Input placeholder="Atul Kumar Mishra" />
                </Form.Item>
                <Form.Item
                  name="image"
                  label="Photo URL"
                  rules={[{ required: true, message: "Paste the image URL" }]}
                >
                  <Input placeholder="https://..." />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              name="designation"
              label="Designation"
              rules={[{ required: true, message: "Enter the designation" }]}
            >
              <Input placeholder="Head - Operations" />
            </Form.Item>

            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Enter a valid email" }]}
              >
                <Input placeholder="name@leatherssc.org" />
              </Form.Item>
              <Form.Item name="mobile" label="Mobile">
                <Input placeholder="9971489936" />
              </Form.Item>
            </div>

            <Form.Item name="linkedin" label="LinkedIn URL">
              <Input placeholder="https://linkedin.com/in/..." />
            </Form.Item>

            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
              <Form.Item
                name="order"
                label="Display order"
                tooltip="Lower numbers appear first"
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>
              <Form.Item
                name="isCeo"
                label="Featured (CEO)"
                valuePropName="checked"
                tooltip="Shown as the large card at the top"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="isActive"
                label="Show on website"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  );
}
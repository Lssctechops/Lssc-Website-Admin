"use client";

import { useRole } from "@/hooks/useRole";
import {
  createCouncilMember,
  deleteCouncilMember,
  fetchCouncilMembers,
  updateCouncilMember,
} from "@/redux/slice/governing-council-slice";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Segmented,
  Skeleton,
  Switch,
  Tooltip,
} from "antd";
import {
  Crown,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function GoverningCouncilPage() {
  const dispatch = useDispatch();
  const { canEditProtected: canEdit } = useRole();
  const { members, loading, saving } = useSelector(
    (state) => state.governingCouncil
  );

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form] = Form.useForm();

  const imageUrl = Form.useWatch("image", form);

  useEffect(() => {
    dispatch(fetchCouncilMembers());
  }, [dispatch]);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      isChairman: false,
      order: (members?.length || 0) + 1,
    });
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      designation: record.designation,
      company: record.company,
      image: record.image,
      order: record.order,
      isActive: record.isActive ?? true,
      isChairman: record.isChairman ?? false,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const id = editing?._id || editing?.id;
      if (editing) {
        await dispatch(updateCouncilMember({ id, payload: values })).unwrap();
        toast.success("Member updated");
      } else {
        await dispatch(createCouncilMember(values)).unwrap();
        toast.success("Member added");
      }
      setOpen(false);
      form.resetFields();
      dispatch(fetchCouncilMembers());
    } catch (error) {
      if (error?.errorFields) return;
      toast.error(error?.message || "Could not save. Try again.");
    }
  };

  const handleDelete = async (record) => {
    try {
      await dispatch(deleteCouncilMember(record._id || record.id)).unwrap();
      toast.success("Member removed");
    } catch (error) {
      toast.error(error?.message || "Could not remove member.");
    }
  };

  const toggleActive = async (record) => {
    const next = !(record.isActive ?? true);
    try {
      await dispatch(
        updateCouncilMember({
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

  const chairman = sorted.find((m) => m.isChairman);

  const list = useMemo(() => {
    let out = sorted.filter((m) => !m.isChairman);
    if (filter === "Live") out = out.filter((m) => m.isActive ?? true);
    if (filter === "Hidden") out = out.filter((m) => !(m.isActive ?? true));
    const q = search.trim().toLowerCase();
    if (!q) return out;
    return out.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.company?.toLowerCase().includes(q) ||
        m.designation?.toLowerCase().includes(q)
    );
  }, [sorted, search, filter]);

  const liveCount = sorted.filter((m) => m.isActive ?? true).length;
  const hiddenCount = sorted.length - liveCount;

  const MemberCard = ({ member }) => {
    const active = member.isActive ?? true;
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
          active ? "border-gray-200" : "border-dashed border-gray-300"
        }`}
      >
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          {member.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.image}
              alt={member.name}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                active ? "" : "opacity-40 grayscale"
              }`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              <Users size={32} />
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            #{member.order ?? "-"}
          </span>

          {!active && (
            <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-600">
              Hidden
            </span>
          )}

          {canEdit && (
            <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 transition-transform duration-200 group-hover:translate-y-0">
              <Tooltip title="Edit">
                <button
                  onClick={() => openEdit(member)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100"
                >
                  <Pencil size={16} />
                </button>
              </Tooltip>
              <Tooltip title={active ? "Hide from website" : "Show on website"}>
                <button
                  onClick={() => toggleActive(member)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-gray-700 hover:bg-gray-100"
                >
                  {active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </Tooltip>
              <Popconfirm
                title="Remove this member?"
                description="They will no longer appear on the website."
                okText="Remove"
                okButtonProps={{ danger: true }}
                cancelText="Cancel"
                onConfirm={() => handleDelete(member)}
              >
                <button className="ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-red-600 hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </Popconfirm>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="truncate font-semibold text-gray-900">
            {member.name}
          </h3>
          <p className="truncate text-sm text-gray-600">
            {member.designation}
          </p>
          <p className="mt-1 truncate text-xs text-gray-400">
            {member.company}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Governing Council
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {canEdit
              ? "Members shown in the Governing Council section of the website."
              : "View only — you don't have permission to edit these."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 font-medium text-gray-700 ring-1 ring-gray-200">
              {sorted.length} total
            </span>
            <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-700 ring-1 ring-green-200">
              {liveCount} live
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600 ring-1 ring-gray-200">
              {hiddenCount} hidden
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Input
            allowClear
            prefix={<Search size={15} className="text-gray-400" />}
            placeholder="Search name or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Segmented
            options={["All", "Live", "Hidden"]}
            value={filter}
            onChange={setFilter}
          />
          <Tooltip title="Refresh">
            <Button
              icon={<RefreshCw size={15} />}
              onClick={() => dispatch(fetchCouncilMembers())}
            />
          </Tooltip>
          {canEdit && (
            <Button type="primary" icon={<Plus size={16} />} onClick={openAdd}>
              Add member
            </Button>
          )}
        </div>
      </div>

      {/* Chairman */}
      <div className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-700">
          <Crown size={16} />
          Chairman
        </div>

        {chairman ? (
          <div className="flex flex-wrap items-center gap-5">
            {chairman.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={chairman.image}
                alt={chairman.name}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-amber-200"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <Crown size={26} />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {chairman.name}
              </h2>
              <p className="text-sm text-gray-600">{chairman.designation}</p>
              <p className="text-xs text-gray-400">{chairman.company}</p>
            </div>

            {canEdit && (
              <Button
                className="ml-auto"
                icon={<Pencil size={15} />}
                onClick={() => openEdit(chairman)}
              >
                Edit
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {canEdit
                ? "No chairman set. Add a member and turn on the Chairman switch."
                : "No chairman set."}
            </p>
            {canEdit && (
              <Button icon={<Plus size={15} />} onClick={openAdd}>
                Set chairman
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Members grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-white p-4">
              <Skeleton.Image active className="!h-40 !w-full" />
              <Skeleton active paragraph={{ rows: 2 }} className="mt-3" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white py-16">
          <Empty
            description={
              search || filter !== "All"
                ? "No members match this search."
                : "No members yet."
            }
          >
            {canEdit && !search && filter === "All" && (
              <Button type="primary" icon={<Plus size={16} />} onClick={openAdd}>
                Add member
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((member) => (
            <MemberCard key={member._id || member.id} member={member} />
          ))}
        </div>
      )}

      {/* Add / Edit modal (only mounts for editors) */}
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
                    className="h-28 w-28 rounded-xl border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl border border-dashed text-gray-300">
                    <Users size={26} />
                  </div>
                )}
              </div>

              <div className="grow">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: "Enter the member's name" }]}
                >
                  <Input placeholder="Shri Sanjay Leekha" />
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

            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: "Enter the designation" }]}
              >
                <Input placeholder="Managing Director" />
              </Form.Item>

              <Form.Item name="company" label="Company">
                <Input placeholder="Alpine Apparels Pvt. Ltd." />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
              <Form.Item
                name="order"
                label="Display order"
                tooltip="Lower numbers appear first in the slider"
              >
                <InputNumber min={1} className="w-full" />
              </Form.Item>

              <Form.Item
                name="isChairman"
                label="Chairman"
                valuePropName="checked"
                tooltip="Shown above the slider as the featured card"
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
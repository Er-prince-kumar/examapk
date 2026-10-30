import React, { useState, useMemo } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const ExamsPage = () => {
  const { exams, subjects, addExam, updateExam, deleteExam } = useWellness();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed'
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'MTT' | 'ETT' | 'Quiz'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    exam_type: 'MTT',
    exam_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    exam_time: '10:00',
    venue: '',
    priority: 'high',
    notes: ''
  });

  const openAddModal = () => {
    setEditingExam(null);
    setFormData({
      title: '',
      subject_id: subjects.length > 0 ? subjects[0].id : '',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '10:00',
      venue: '',
      priority: 'high',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subject_id: exam.subject_id || '',
      exam_type: exam.exam_type,
      exam_date: exam.exam_date,
      exam_time: exam.exam_time || '10:00',
      venue: exam.venue || '',
      priority: exam.priority || 'high',
      notes: exam.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.exam_date) return;

    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam(formData);
    }
    setIsModalOpen(false);
  };

  // Filter & sort exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchTab = activeTab === 'completed' ? exam.is_completed : !exam.is_completed;
      const matchType = filterType === 'ALL' || exam.exam_type === filterType;
      return matchTab && matchType;
    });
  }, [exams, activeTab, filterType]);

  const calculateDaysLeft = (examDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = new Date(examDate).setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium':
        return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MTT & ETT Exam Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize examination dates, venues, priority topics, and live countdowns.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Exam</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-subtle">
        {/* Upcoming vs Completed */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'upcoming'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Upcoming Exams ({exams.filter((e) => !e.is_completed).length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'completed'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Completed ({exams.filter((e) => e.is_completed).length})
          </button>
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {['ALL', 'MTT', 'ETT', 'Quiz', 'Lab'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${
                filterType === type
                  ? 'bg-cyan-100 text-cyan-800'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Cards Grid */}
      {filteredExams.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={activeTab === 'upcoming' ? 'No Upcoming Exams Found' : 'No Completed Exams'}
          description="Keep your timetable up to date so your study schedule can adapt in real-time."
          actionLabel="+ Schedule Exam"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const daysLeft = calculateDaysLeft(exam.exam_date);
            const isToday = daysLeft === 0;
            const isPast = daysLeft < 0;
            const matchingSubject = subjects.find((s) => s.id === exam.subject_id);

            return (
              <div
                key={exam.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-subtle hover:shadow-card transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-400 text-[11px] font-black uppercase tracking-wider">
                      {exam.exam_type}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getPriorityBadge(exam.priority)} uppercase`}>
                        {exam.priority}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {exam.title}
                  </h3>
                  {matchingSubject && (
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: matchingSubject.color }} />
                      <span>{matchingSubject.code}: {matchingSubject.name}</span>
                    </p>
                  )}

                  {/* Date & Time */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(exam.exam_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Time: {exam.exam_time}</span>
                    </div>
                    {exam.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Venue: {exam.venue}</span>
                      </div>
                    )}
                  </div>

                  {exam.notes && (
                    <p className="text-xs text-slate-500 mt-3 italic line-clamp-2">
                      "{exam.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Countdown & Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    {!exam.is_completed && (
                      <div>
                        {isToday ? (
                          <span className="px-2.5 py-1 rounded-xl bg-rose-500 text-white text-xs font-black animate-pulse">
                            TODAY!
                          </span>
                        ) : isPast ? (
                          <span className="text-xs font-bold text-slate-400">Past Exam</span>
                        ) : (
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-cyan-600 font-mono">{daysLeft}</span>
                            <span className="text-xs font-semibold text-slate-500">days left</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateExam(exam.id, { is_completed: !exam.is_completed })}
                      className={`p-2 rounded-xl transition ${
                        exam.is_completed
                          ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                      }`}
                      title={exam.is_completed ? 'Mark uncompleted' : 'Mark exam completed'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(exam)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Edit exam"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(exam.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete exam"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExam ? 'Edit Examination' : 'Schedule Examination'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Title / Subject Name</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Operating Systems & System Programming"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Examination Type</label>
              <select
                value={formData.exam_type}
                onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="MTT">MTT (Mid Term Test)</option>
                <option value="ETT">ETT (End Term Test)</option>
                <option value="Quiz">Continuous Assessment / Quiz</option>
                <option value="Lab">Practical / Lab Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date</label>
              <input
                type="date"
                value={formData.exam_date}
                onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Time</label>
              <input
                type="time"
                value={formData.exam_time}
                onChange={(e) => setFormData({ ...formData, exam_time: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Venue / Room (Optional)</label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Block 34, Hall 402"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Syllabus Topics & High-Weightage Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Focus on Semaphores, Deadlock Avoidance, and Page Replacement algorithms."
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteExam(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Examination?"
        message="Are you sure you want to remove this examination from your schedule?"
        confirmText="Delete Exam"
        isDanger={true}
      />
    </div>
  );
};


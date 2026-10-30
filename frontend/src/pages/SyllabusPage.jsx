import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext.jsx';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  BarChart2,
  Sparkles,
  ChevronRight,
  Trash2,
  Layers
} from 'lucide-react';
import { Modal } from '../components/common/Modal.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';

export const SyllabusPage = () => {
  const { subjects, syllabus, addSubject, addTopic, updateTopicStatus } = useWellness();
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  // Subject form
  const [subForm, setSubForm] = useState({ code: '', name: '', color: '#06b6d4', credits: 4 });

  // Topic form
  const [topicForm, setTopicForm] = useState({
    subject_id: selectedSubjectId,
    chapter_name: '',
    title: '',
    difficulty: 'medium'
  });

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectTopics = syllabus.filter((t) => t.subject_id === activeSubject?.id);

  const completedTopicsCount = subjectTopics.filter((t) => t.status === 'completed').length;
  const progressPercent = subjectTopics.length > 0
    ? Math.round((completedTopicsCount / subjectTopics.length) * 100)
    : 0;

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subForm.code || !subForm.name) return;
    addSubject(subForm);
    setSubForm({ code: '', name: '', color: '#06b6d4', credits: 4 });
    setIsSubModalOpen(false);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!topicForm.title) return;
    addTopic({
      ...topicForm,
      subject_id: activeSubject?.id || selectedSubjectId
    });
    setTopicForm({
      subject_id: selectedSubjectId,
      chapter_name: '',
      title: '',
      difficulty: 'medium'
    });
    setIsTopicModalOpen(false);
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'hard':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Subjects & Syllabus Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track chapter completion, revision counts, and difficulty bottlenecks across your semester courses.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSubModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            + Add Subject
          </button>
          <button
            onClick={() => setIsTopicModalOpen(true)}
            disabled={!activeSubject}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition disabled:opacity-50"
          >
            + Add Topic
          </button>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {subjects.map((sub) => {
          const subTopics = syllabus.filter((t) => t.subject_id === sub.id);
          const completedCount = subTopics.filter((t) => t.status === 'completed').length;
          const pct = subTopics.length > 0 ? Math.round((completedCount / subTopics.length) * 100) : 0;
          const isSelected = sub.id === (activeSubject?.id || selectedSubjectId);

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`p-4 rounded-2xl border transition text-left min-w-[200px] shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-800 border-slate-200/80 hover:border-cyan-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-slate-800 text-cyan-400' : 'bg-slate-100 text-slate-700'
                }`}>
                  {sub.code}
                </span>
                <span className="text-xs font-bold font-mono">{pct}%</span>
              </div>
              <h4 className="font-bold text-sm mt-2 truncate">{sub.name}</h4>
              <div className="w-full bg-slate-200/40 rounded-full h-1.5 mt-2.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: sub.color || '#06b6d4' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Overview & Topic List */}
      {activeSubject ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeSubject.color }} />
                <h2 className="text-xl font-bold text-slate-900">{activeSubject.code} — {activeSubject.name}</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {activeSubject.credits} Credits • {subjectTopics.length} Total Topics • {completedTopicsCount} Finished
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{progressPercent}%</span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Syllabus Covered</p>
              </div>
            </div>
          </div>

          {/* Topics List */}
          {subjectTopics.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No topics added to this subject"
              description="Add chapters and syllabus units to begin tracking revision status."
              actionLabel="+ Add First Topic"
              onAction={() => setIsTopicModalOpen(true)}
            />
          ) : (
            <div className="space-y-3">
              {subjectTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition ${
                    topic.status === 'completed'
                      ? 'bg-slate-50/70 border-slate-100'
                      : topic.status === 'in_progress'
                      ? 'bg-cyan-50/40 border-cyan-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => {
                        const next = topic.status === 'completed' ? 'not_started' : topic.status === 'in_progress' ? 'completed' : 'in_progress';
                        updateTopicStatus(topic.id, next);
                      }}
                      className="p-1 rounded-lg mt-0.5 text-slate-400 hover:text-cyan-600 transition"
                      title="Click to cycle status"
                    >
                      {topic.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : topic.status === 'in_progress' ? (
                        <Clock className="w-5 h-5 text-cyan-500 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">
                          {topic.chapter_name || 'Unit'}
                        </span>
                        <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold uppercase border ${getDifficultyBadge(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                        {topic.revision_count > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            {topic.revision_count}x Revised
                          </span>
                        )}
                      </div>
                      <h4 className={`text-sm font-semibold mt-1 ${topic.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {topic.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={topic.status}
                      onChange={(e) => updateTopicStatus(topic.id, e.target.value)}
                      className="text-xs font-semibold rounded-xl border border-slate-200 px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Add Subject Modal */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Add Semester Subject">
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
            <input
              type="text"
              value={subForm.code}
              onChange={(e) => setSubForm({ ...subForm, code: e.target.value.toUpperCase() })}
              placeholder="e.g. CSE316"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500 uppercase"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
            <input
              type="text"
              value={subForm.name}
              onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
              placeholder="e.g. Operating Systems"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={subForm.credits}
                onChange={(e) => setSubForm({ ...subForm, credits: Number(e.target.value) })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Color Tag</label>
              <input
                type="color"
                value={subForm.color}
                onChange={(e) => setSubForm({ ...subForm, color: e.target.value })}
                className="w-full h-9 border border-slate-200 rounded-xl px-1 py-1 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsSubModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Topic Modal */}
      <Modal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} title={`Add Topic to ${activeSubject?.code}`}>
        <form onSubmit={handleAddTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chapter / Unit Name</label>
            <input
              type="text"
              value={topicForm.chapter_name}
              onChange={(e) => setTopicForm({ ...topicForm, chapter_name: e.target.value })}
              placeholder="e.g. Unit 3: Memory Management"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topic Title</label>
            <input
              type="text"
              value={topicForm.title}
              onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
              placeholder="e.g. Paging, Multi-level page tables & TLB Hit Rate"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
            <select
              value={topicForm.difficulty}
              onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="easy">Easy (Quick revision)</option>
              <option value="medium">Medium (Moderate practice)</option>
              <option value="hard">Hard (High weightage / Deep numericals)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsTopicModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition"
            >
              Add Topic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};


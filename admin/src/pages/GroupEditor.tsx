import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchGroup, createGroup, updateGroup, replaceSchedules } from '../api/client';
import type { GroupWithSchedules } from '../api/client';

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface ScheduleRow {
  days: string[];
  time: string;
}

type ApiScheduleRow = {
  days: string[] | string;
  time?: string;
};

type GroupApiResponse = GroupWithSchedules & {
  schedule?: ApiScheduleRow[];
  mapLink?: string;
  videoPath?: string;
  imageUrl?: string;
};

interface GroupForm {
  name: string;
  key: string;
  type: 'aa' | 'alanon';
  city: string;
  address: string;
  description: string;
  phone: string;
  map_link: string;
  video_path: string;
  image_url: string;
  notes: string;
  sort_order: number;
}

const emptyForm: GroupForm = {
  name: '',
  key: '',
  type: 'aa',
  city: '',
  address: '',
  description: '',
  phone: '',
  map_link: '',
  video_path: '',
  image_url: '',
  notes: '',
  sort_order: 0,
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

export default function GroupEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<GroupForm>(emptyForm);
  const [schedules, setSchedules] = useState<ScheduleRow[]>([{ days: [], time: '' }]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadGroup(Number(id));
    }
  }, [id, isEdit]);

  async function loadGroup(groupId: number) {
    try {
      setLoading(true);
      const data = await fetchGroup(groupId) as GroupApiResponse;
      setForm({
        name: data.name || '',
        key: data.key || '',
        type: data.type || 'aa',
        city: data.city || '',
        address: data.address || '',
        description: data.description || '',
        phone: data.phone || '',
        map_link: data.mapLink || data.map_link || '',
        video_path: data.videoPath || data.video_path || '',
        image_url: data.imageUrl || data.image_url || '',
        notes: data.notes || '',
        sort_order: data.sort_order || 0,
      });
      const sched = data.schedule || data.schedules || [];
      if (sched.length > 0) {
        setSchedules(
          sched.map((s: ApiScheduleRow) => {
            let days: string[] = [];
            if (typeof s.days === 'string') {
              try { days = JSON.parse(s.days); } catch { days = s.days.split(',').filter(Boolean); }
            } else if (Array.isArray(s.days)) {
              days = s.days;
            }
            return { days, time: s.time || '' };
          })
        );
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Ошибка загрузки'));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'sort_order' ? Number(value) : value,
    } as GroupForm));
  }

  function toggleDay(rowIdx: number, day: string) {
    setSchedules((prev) =>
      prev.map((row, i) => {
        if (i !== rowIdx) return row;
        const days = row.days.includes(day)
          ? row.days.filter((d) => d !== day)
          : [...row.days, day];
        return { ...row, days };
      })
    );
  }

  function updateTime(rowIdx: number, time: string) {
    setSchedules((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, time } : row))
    );
  }

  function addRow() {
    setSchedules((prev) => [...prev, { days: [], time: '' }]);
  }

  function removeRow(idx: number) {
    setSchedules((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError('');

      let groupId: number;
      if (isEdit && id) {
        await updateGroup(Number(id), form);
        groupId = Number(id);
      } else {
        const result = await createGroup(form);
        groupId = result.id;
      }

      const scheduleData = schedules
        .filter((s) => s.days.length > 0 && s.time)
        .map((s) => ({ days: s.days, time: s.time }));

      await replaceSchedules(groupId, scheduleData);
      navigate('/groups');
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Ошибка сохранения'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="state-loading">Загрузка...</div>;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <Link to="/groups" className="back-link">&#8592; Назад</Link>
        <span className="page-header-title">
          {isEdit ? 'Редактирование' : 'Новая группа'}
        </span>
        <div className="page-header-side" />
      </div>

      {error && <div className="banner-error">{error}</div>}

      <div className="form-card" style={{ marginBottom: 14 }}>
        <Field label="Название">
          <input name="name" value={form.name} onChange={handleChange} className="input" />
        </Field>

        <Field label="Ключ">
          <input
            name="key"
            value={form.key}
            onChange={handleChange}
            className="input"
            placeholder="Оставьте пустым для авто"
          />
        </Field>

        <Field label="Тип">
          <select name="type" value={form.type} onChange={handleChange} className="input">
            <option value="aa">АА</option>
            <option value="alanon">Ал-Анон</option>
          </select>
        </Field>

        <Field label="Город">
          <input name="city" value={form.city} onChange={handleChange} className="input" />
        </Field>

        <Field label="Адрес">
          <input name="address" value={form.address} onChange={handleChange} className="input" />
        </Field>

        <Field label="Описание">
          <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={3} />
        </Field>

        <Field label="Телефон">
          <input name="phone" value={form.phone} onChange={handleChange} className="input" />
        </Field>

        <Field label="Ссылка на карту">
          <input name="map_link" value={form.map_link} onChange={handleChange} className="input" />
        </Field>

        <Field label="Видео">
          <input name="video_path" value={form.video_path} onChange={handleChange} className="input" />
        </Field>

        <Field label="Изображение (URL)">
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input" />
        </Field>

        <Field label="Заметки">
          <textarea name="notes" value={form.notes} onChange={handleChange} className="input" rows={2} />
        </Field>

        <Field label="Порядок сортировки">
          <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="input" />
        </Field>
      </div>

      {/* Schedules */}
      <div style={{ marginBottom: 14 }}>
        <div className="section-label">Расписание</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {schedules.map((row, idx) => (
            <div key={idx} className="schedule-row">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {DAY_LABELS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx, day)}
                    className={`day-btn${row.days.includes(day) ? ' selected' : ''}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Время (напр. 19:00)"
                  value={row.time}
                  onChange={(e) => updateTime(idx, e.target.value)}
                  className="input"
                  style={{ flex: 1 }}
                />
                {schedules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(idx)}
                    className="btn btn-danger"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="btn btn-secondary"
          style={{ marginTop: 8 }}
        >
          + Добавить расписание
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary btn-full"
      >
        {saving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </div>
  );
}

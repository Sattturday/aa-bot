import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchGroup, createGroup, updateGroup, replaceSchedules } from '../api/client';

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

interface ScheduleRow {
  days: string[];
  time: string;
}

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
  }, [id]);

  async function loadGroup(groupId: number) {
    try {
      setLoading(true);
      const data = await fetchGroup(groupId);
      setForm({
        name: data.name || '',
        key: data.key || '',
        type: data.type || 'aa',
        city: data.city || '',
        address: data.address || '',
        description: data.description || '',
        phone: data.phone || '',
        map_link: data.map_link || '',
        video_path: data.video_path || '',
        image_url: data.image_url || '',
        notes: data.notes || '',
        sort_order: data.sort_order || 0,
      });
      if (data.schedules && data.schedules.length > 0) {
        setSchedules(
          data.schedules.map((s: any) => ({
            days: typeof s.days === 'string' ? s.days.split(',').filter(Boolean) : s.days || [],
            time: s.time || '',
          }))
        );
      }
    } catch (e: any) {
      setError(e.message || 'Ошибка загрузки');
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
        .map((s) => ({ days: s.days.join(','), time: s.time }));

      await replaceSchedules(groupId, scheduleData);
      navigate('/groups');
    } catch (e: any) {
      setError(e.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/groups" className="text-blue-500 hover:underline">&larr; Назад</Link>
        <h1 className="text-xl font-bold">{isEdit ? 'Редактирование группы' : 'Новая группа'}</h1>
        <div />
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Название</label>
          <input name="name" value={form.name} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ключ</label>
          <input name="key" value={form.key} onChange={handleChange} className="input" placeholder="Заполните вручную или оставьте пустым" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Тип</label>
          <select name="type" value={form.type} onChange={handleChange} className="input">
            <option value="aa">АА</option>
            <option value="alanon">Ал-Анон</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Город</label>
          <input name="city" value={form.city} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Адрес</label>
          <input name="address" value={form.address} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input" rows={3} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ссылка на карту</label>
          <input name="map_link" value={form.map_link} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Видео</label>
          <input name="video_path" value={form.video_path} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Изображение (URL)</label>
          <input name="image_url" value={form.image_url} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Заметки</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} className="input" rows={2} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Порядок сортировки</label>
          <input name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="input" />
        </div>

        {/* Schedules */}
        <div>
          <label className="block text-sm font-medium mb-2">Расписание</label>
          <div className="space-y-3">
            {schedules.map((row, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {DAY_LABELS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(idx, day)}
                      className={`px-2 py-1 rounded text-sm ${
                        row.days.includes(day)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Время (напр. 19:00)"
                    value={row.time}
                    onChange={(e) => updateTime(idx, e.target.value)}
                    className="input flex-1"
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
          <button type="button" onClick={addRow} className="btn btn-secondary mt-2">
            + Добавить расписание
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary w-full"
        >
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

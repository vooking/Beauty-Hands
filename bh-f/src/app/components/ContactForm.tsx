'use client';

import { useState } from 'react';
import styles from "@/app/page.module.css";
import "@/app/globals.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Ошибка при отправке');

      setForm({ name: '', phone: '', message: '' });
      setSuccess(true);
    } catch (error) {
      alert('Не удалось отправить сообщение');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-6 p-4 border rounded-xl shadow bg-white">
      <h2 className={`text-2xl font-semibold text-center ${styles.titleMain}`}>Форма обратной связи</h2>

      <input
        type="text"
        name="name"
        placeholder="Ваше имя"
        value={form.name}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        required
      />

      <textarea
        name="message"
        placeholder="Сообщение"
        value={form.message}
        onChange={handleChange}
        className="w-full p-3 border rounded h-32"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-gray-600 text-gray-800 text-[20px] px-10 py-3 rounded-[10px] hover:bg-gray-100 transition"
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>

      {success && (
        <p className="text-green-600 text-center font-medium">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
      )}
    </form>
  );
}

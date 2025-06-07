'use client';

import { useState, useCallback, useEffect } from 'react';
import Script from 'next/script';
import styles from "@/app/page.module.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '+7', message: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[а-яА-ЯёЁa-zA-Z\s]*$/.test(value)) {
      setForm(prev => ({ ...prev, name: value }));
    }
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/[^\d+]/g, '');
    
    if (cleanedValue.startsWith('+7') && cleanedValue.length <= 12) {
      setForm(prev => ({ ...prev, phone: cleanedValue }));
    } else if (cleanedValue === '+' || cleanedValue === '') {
      setForm(prev => ({ ...prev, phone: '+7' }));
    }
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, message: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.phone.length !== 12) {
      setNotification({ message: 'Номер телефона должен содержать 11 цифр (включая +7)', type: 'error' });
      return;
    }

    const captchaToken = (window as any).grecaptcha?.getResponse();

    if (!captchaToken) {
      setNotification({ message: 'Пожалуйста, подтвердите, что вы не робот', type: 'error' });
      return;
    }

    setLoading(true);
    setNotification(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer your-token',
        },
        body: JSON.stringify({ ...form, 'g-recaptcha-response': captchaToken }),
      });

      if (!response.ok) throw new Error('Ошибка при отправке');

      setForm({ name: '', phone: '+7', message: '' });
      setNotification({ message: 'Спасибо! Мы свяжемся с вами в ближайшее время.', type: 'success' });
      (window as any).grecaptcha?.reset();
    } catch {
      setNotification({ message: 'Не удалось отправить сообщение. Попробуйте позже.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="relative">
      <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />

      {notification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg animate-notification ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-10 space-y-6 p-4 border rounded-xl shadow bg-white">
        <h2 className={`text-2xl font-semibold text-center ${styles.titleMain}`}>Форма обратной связи</h2>

        <input
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={form.name}
          onChange={handleNameChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={form.phone}
          onChange={handlePhoneChange}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          name="message"
          placeholder="Сообщение"
          value={form.message}
          onChange={handleMessageChange}
          className="w-full p-3 border rounded h-32"
          required
        />

        <div className="g-recaptcha" data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}></div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-gray-600 text-gray-800 text-[20px] px-10 py-3 rounded-[10px] hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
}
